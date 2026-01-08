/**
 * 프로젝트 공통 상태 컬러 테마
 * * [주의] 직접적인 색상 코드(HEX) 대신 App.css에 정의된 CSS 변수를 참조합니다.
 * 색상 값을 수정해야 할 경우 'src/App.css'의 root 설정을 변경하세요.
 */
const STATUS_COLOR = {
  SAFE: 'var(--color-safe)',
  WARNING: 'var(--color-warning)',
  DANGER: 'var(--color-danger)',
};

export default STATUS_COLOR;