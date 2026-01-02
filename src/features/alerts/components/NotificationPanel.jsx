import { useEffect, useRef, useState } from "react"
import { useOutsideClick } from "../hooks/useOutsideClick"
import { alertApi } from "../api/alertApi"
import NotificationTabs from "./NotificationTabs"
import Loading from "../../../components/Loading/Loading"
import NotificationItem from "./NotificationItem"
import AlertDetailModal from "./AlertDetailModal"
import { useEmergencyAlertContext } from "../../emergency/context/EmergencyAlertContext";
import PinModal from "./PinModal"

const NotificationPanel = ({onClose}) => {
  const ref = useRef(null)
  const {closeAlert} = useEmergencyAlertContext?.() ?? {} // 없어도 에러 안나게
  
  const [tab, setTab] = useState("ALL")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [pinOpen, setPinOpen] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [targetAlert, setTargetAlert] = useState(null)
  
  useOutsideClick(ref, () => {
    if (detailOpen || pinOpen) return
    onClose()
  })

  const load = async (t) => {
    setLoading(true)
    try {
      let res
      if (t === "ALL") res = await alertApi.fetchAll()
      if (t === "ACTIVE") res = await alertApi.fetchActive()
      if (t === "RESOLVED") res = await alertApi.fetchResolved()
      
      if (res?.ok) {
        setItems(res.data ?? [])
      } else {
        setItems([])
      }
    } finally {
      setLoading(false)
    }
  }
  
  // 탭 변경 시 로드
  useEffect(() => {
    setDetailOpen(false)
    setSelected(null)
    load(tab)
  }, [tab])

  const openDetail = (a) => {
    setSelected(a)
    setDetailOpen(true)
  }

  // 해결 버튼 클릭 -> PIN 모달 오픈
  const openResolvePin = (a) => {
    setTargetAlert(a)
    setPinOpen(true)
  }

  const submitPin = async (pin) => {
    if (!targetAlert) return
    setResolving(true)
    try {
      const res = await alertApi.resolveById(targetAlert.id, pin)

      if (!res.ok) {
        alert(res.message ?? "해결 처리 실패 ")
        return
      }

      // 성공: 리스트 갱신
      setPinOpen(false);
      setTargetAlert(null)
      await load(tab)

      // 전역  긴급모달 열려 있으면 닫기
      closeAlert?.()
    } finally {
      setResolving(false)
    }
  }

  return (
    <div className="npanel" ref={ref}>
      <div className="npanel-header">
        <span className="npanel-title">알림</span>
      </div>

      <NotificationTabs tab={tab} setTab={setTab} />

      <div className="npanel-body">
        {loading ? (
          <Loading message="알림을 불러오는 중입니다...."/>
        ) : items.length === 0 ? (
          <div className="nempty">알림이 없습니다.</div>
        ) : (
          items.map((a) => (
            <NotificationItem 
              key={a.id} 
              data={a} 
              onClick={() => openDetail(a)}
              onResolveClick={() => openResolvePin(a)}
            />
          ))
        )}
      </div>

      <AlertDetailModal 
        open={detailOpen}
        alert={selected}
        onClose={() => setDetailOpen(false) }
      />

      <PinModal
        open={pinOpen}
        loading={resolving}
        onClose={() => setPinOpen(false)}
        onSubmit={submitPin}
      />
    </div>
  )
}

export default NotificationPanel