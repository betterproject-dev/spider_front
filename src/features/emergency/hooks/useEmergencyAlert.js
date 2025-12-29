import { useEffect, useRef } from "react"
import { useEmergencyAlertContext } from "../context/EmergencyAlertContext"

export const useEmergencyAlert = (sensorValue, limit = 80) => {
  const {openAlert, closeAlert} = useEmergencyAlertContext()
  const timeRef = useRef(null)

  useEffect(() => {
    if (sensorValue > limit) {
      if(!timeRef.current) {
        timeRef.current = setTimeout(() => {
          openAlert({
            machineNo: 4,
            sensorValue,
            message: "온도 허용치 30초 초과"
          })
        }, 30000)
      }
    } else {
      clearTimeout(timeRef.current)
      timeRef.current = null
      closeAlert()
    }
  }, [sensorValue])
}