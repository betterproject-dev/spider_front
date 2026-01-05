import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const PinModal = ({ open, onClose, onSubmit, loading }) => {
  const [pin, setPin] = useState("")
  const inputRef = useRef(null)

  // 모달이 열리때만 PIN 초기화
  useEffect(() => {
    if (open) {
      setPin("")
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  if (!open) return null

  const handleSumit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!pin.trim()) return
    if (loading) return
    onSubmit(pin)
  }

  const ui = (
    <div className="pmodal-backdrop" onMouseDown={onClose}>
      <div
        className="pmodal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="pmodal-head">
          <div className="pmodal-title">관리자 PIN 입력</div>
          <button className="pmodal-x" onClick={onClose} type="button">✕</button>
        </div>

        <form onSubmit={handleSumit}>
          <input
            ref={inputRef}
            type="password"
            className="pmodal-input"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} // 숫자만
            placeholder="PIN"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            autoFocus
          />
        </form>

        <div className="pmodal-actions">
          <button className="pmodal-cancel" onClick={onClose} type="button">
            취소
          </button>
          <button
            className="pmodal-ok"
            type="submit"
            disabled={loading || pin.trim().length === 0}
          >
            {loading ? "처리중..." : "해결"}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(ui, document.body)
}

export default PinModal
