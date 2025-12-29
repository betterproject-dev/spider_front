import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * 긴급 알림 전역 상태 Context
 * - 관리자 화면에서 발생하는 긴급 상황(센서 초과 등)을 전역으로 관리
 */
// createContext는 React 컴포넌트 트리 전체에 값을 전달하기 위한 ‘전역 공유 통로’를 만드는 함수
// 기본 값 null → Provider 없이 쓰면 에러 나게 만들기 위함(안전)
const EmergencyAlertContext = createContext(null) 

/**
 * 긴급 알림 초기 상태
 */
// 알림이 꺼진 상태의 기준값, 객체를 재사용하므로 실수 방지
// closeAlert()에서 항상 이 상태로 되돌림
const INITIAL_ALERT = {
  isOpen: false,
  machineNo: null,
  sensorValue: null,
  message: ""
}

/**
 * 긴급 알림 Context Provider
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - 하위 컴포넌트
 */
// Provider로 감싼 컴포넌트 트리 전체에서 alert / openAlert / closeAlert 사용 가능
export const EmergencyAlertProvider = ({children}) => {
  const [alert, setAlert] = useState(INITIAL_ALERT) // 현재 긴급 알림 상태, 모달에서 그대로 사용됨

  /**
   * 긴급 알림 열기
   *
   * @param {{machineNo:number, sensorValue:number, message:string}} data
   */
  // useCallback사용: 매 렌더마다 함수가 새로 생성되지 않게 고정, useEffect 의존성에서 불필요한 재실행 방지
  const openAlert = useCallback((data) => {
    setAlert({isOpen: true, ...data})
  }, [])

  /**
   * 긴급 알림 닫기 (초기 상태로 리셋)
   */
  const closeAlert = useCallback(() => {
    setAlert(INITIAL_ALERT)
  }, [])

  // Provider가 리렌더될 때마다 Context 소비자 전부 리렌더됨
  // useMemo 덕분에 alert가 바뀔 때만 리렌더
  const value = useMemo(() => ({alert, openAlert, closeAlert}), [alert, openAlert, closeAlert])

  return (
    <EmergencyAlertContext.Provider
      value={value}
    >
      {children}
    </EmergencyAlertContext.Provider>
  )
}

/**
 * 긴급 알림 Context 사용 훅
 *
 * @returns {{
 *  alert: {
 *    isOpen:boolean,
 *    machineNo:number|null,
 *    sensorValue:number|null,
 *    message:string
 *  },
 *  openAlert: Function,
 *  closeAlert: Function
 * }}
 */
export const useEmergencyAlertContext = () => {
  const ctx = useContext(EmergencyAlertContext)
  if (!ctx) {
    throw new Error ("EmergencyAlertProvider로 감싸야 합니다")
  }

  return ctx
}