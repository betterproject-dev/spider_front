import UseNavi from '../../../hooks/UseNavi';
import '../style/Navbar.css'

/**
 * 페이지 상단에 위치하는 경로 안내 네비바
 * @param {boolean} detail - 상세 페이지 여부 (기본값: false) ex. '1호기' 페이지는 상세 페이지(하위 페이지)가 아님
 * @param {string} sort - 네비바에 명시할 상세 페이지 종류 (예: '센서', '불량제품') ex. '1호기' 페이지에서 들어가는 온도 센서 상세 페이지
 * @param {number|string} selectedMachine - 현재 선택된 설비 번호 (예: 1, 2, 8) - 경로(Breadcrumb)에 'N호기' 형태로 표시됨
 */
const Navbar = ({ detail, sort, selectedMachine }) => {
  const { goTo } = UseNavi();
  
  return (
    <>
      <div className="navi">
        <p>
          {/* (공통) 메인 모니터링 페이지로 이동 */}
          <span className='navi-cursor' onClick={() => goTo("/monitor")}>메인 모니터링</span>
        {
          detail
          ? (
            /* 상세 페이지(센서/불량 등)인 경우의 경로 표시 */
            <>
            {/* 선택한 기계 대시보드로 이동 */}
            <span className='navi-cursor' onClick={() => goTo("/dashboard")}> &gt; {selectedMachine}호기</span>
            {/* 현재 보고 있는 상세 메뉴 이름 (클릭 불가) */}
            <span> &gt; {sort}</span>
            </>
          )
          /* 단순히 기계 대시보드 메인인 경우 */
          : (<span> &gt; {selectedMachine}호기</span>)
        }
        </p>
      </div>
    </>
  )
}

export default Navbar;