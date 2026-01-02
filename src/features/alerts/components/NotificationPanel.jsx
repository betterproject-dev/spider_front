import { useEffect, useRef, useState } from "react"
import { useOutsideClick } from "../hooks/useOutsideClick"
import { alertApi } from "../api/alertApi"
import NotificationTabs from "./NotificationTabs"
import Loading from "../../../components/Loading/Loading"
import NotificationItem from "./NotificationItem"
import AlertDetailModal from "./AlertDetailModal"

const NotificationPanel = ({onClose}) => {
  const ref = useRef(null)
  
  const [tab, setTab] = useState("ALL")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  
  useOutsideClick(ref, () => {
    if (detailOpen) return
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
              onResolved={() => load(tab)}
            />
          ))
        )}
      </div>

      <AlertDetailModal 
        open={detailOpen}
        alert={selected}
        onClose={() => setDetailOpen(false) }
      />
    </div>
  )
}

export default NotificationPanel