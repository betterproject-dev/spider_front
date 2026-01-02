import { useEffect } from "react"

/**
 * useOutsideClick
 *
 * 특정 요소(ref) 바깥을 클릭했을 때 콜백을 실행하는 커스텀 훅
 *
 * 사용 예:
 * - 모달 닫기
 * - 드롭다운 닫기
 * - 팝오버/툴팁 닫기
 *
 * 동작 방식:
 * - document 전체에 mousedown 이벤트를 등록
 * - 클릭한 대상이 ref 영역에 포함되지 않으면 onOutside 실행
 *
 * @param {React.RefObject<HTMLElement>} ref
 *   기준이 되는 DOM 요소의 ref
 *
 * @param {Function} onOutside
 *   ref 바깥 클릭 시 실행할 콜백 함수
 */
export const useOutsideClick = (ref, onOutside) => {
  useEffect(() => {
    /**
     * 문서 전체 클릭 이벤트 핸들러
     */
    const handler = (e) => {
      // ref가 아직 연결되지 않았을 경우 무시
      if (!ref.current) return
      // 클릭한 요소가 ref 내부가 아닐 때만 콜백 실행
      if (!ref.current.contains(e.target)) onOutside?.()
    }

    // 마우스 클릭 시점에 감지 (focus 변경보다 빠름)
    document.addEventListener("mousedown", handler)

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => document.removeEventListener("mousedown", handler)
  }, [ref, onOutside])
}