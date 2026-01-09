import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/SidebarCalendar.css"; // 전용 스타일
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import requestHandler from '../../../utils/requestHandler';
import { formatDateTime } from '../../../utils/formatDate';


const SidebarCalendar = memo(() => {
  const [events, setEvents] = useState([]);
  const [currentYearMonth, setCurrentYearMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(null); 
  useEffect(() => {
    loadNotionMemos();
  }, []);

const loadNotionMemos = useCallback(async () => {
  const result = await requestHandler({
      method: "get",
      url: "/api/notion/memos",
      server: "spring"
    });
    // result.ok가 true라면 data에는 백엔드에서 보낸 List<NotionDTO>가 들어있습니다.
    if (result.ok) {
      setEvents(result.data || []);
    } else {
      console.error("데이터 로드 실패:", result.message);
    }
  }, []);

  // ✅ 2. 달력의 월이 바뀔 때마다 실행되는 함수
  const handleDatesSet = useCallback((dateInfo) => {
    // view의 현재 타이틀이나 범위를 통해 'YYYY-MM' 추출
    const midDate = new Date(dateInfo.start.getTime() + (dateInfo.end.getTime() - dateInfo.start.getTime()) / 2);
    const yyyymm = midDate.toISOString().slice(0, 7);
    setCurrentYearMonth(yyyymm);
    
  }, []);

    // ✅ 날짜 클릭 시 해당 날짜만 필터링 (메모 입력 X)
  const handleDateClick = useCallback((arg) => {
    setSelectedDate(arg.dateStr); // 선택된 날짜 저장
  }, []);

  const handleAddMemo = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const dateStr = selectedDate || today;
  
    // ✅ 오늘 날짜가 아니면 추가 불가
    if (dateStr !== today) {
      alert("메모는 오늘 날짜에만 추가할 수 있습니다.");
      return;
    }
    const memoText = prompt(`${dateStr} 메모 입력:`);
    if (!memoText) return;

    const result = await requestHandler({
      method: "post",
      url: "/api/notion/memo",
      server: "spring",
      payload: { title: memoText, date: dateStr }, // NotionDTO 구조와 일치
    });

    if (result.ok) {
      loadNotionMemos(); // 성공 시 새로고침
    } else {
      alert("노션 저장 오류: " + result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("메모를 삭제하시겠습니까?")) return;

    const result = await requestHandler({
      method: "delete",
      url: `/api/notion/memo/${id}`,
      server: "spring",
    });
    if (result.ok) {
      // 삭제 성공 시 리스트 갱신 (전체 로드 혹은 필터링)
      setEvents(prev => prev.filter(ev => ev.id !== id));
    }
  };

  // ✅ 3. 현재 월(currentYearMonth)과 일치하는 데이터만 필터링
  const filteredMemos = useMemo(() => {
    if (!selectedDate) return [];
    return events
      .filter(ev => ev.date.startsWith(selectedDate))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events, selectedDate]);

  return (
    <div className="sidebar_calendar_wrapper">
      <div className="mini_calendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          height="auto"
          locale="ko"
          dateClick={handleDateClick}
          datesSet={handleDatesSet}
          events={events}
          dayHeaderFormat={{ weekday: 'short' }}
          dayCellContent={(args) => {
            return args.dayNumberText.replace('일', '');
          }}
        />
      </div>
      <div className="memo_summary">
        <p className="summary_title"> {selectedDate ? `${selectedDate} 일지` : '최근 일지 기록 (Notion)'}</p>
        <button className="memo_add_btn" onClick={handleAddMemo}>+</button>
        <ul className="summary_list">
          {!selectedDate ? (
            <li className="empty_msg" style={{ textAlign: 'center', padding: '20px 0' }}>
              📅 날짜를 선택해 주세요
            </li>
          ) : filteredMemos.length === 0 ? (
            <li className="empty_msg" style={{ textAlign: 'center', padding: '20px 0' }}>
              메모가 없습니다
            </li>
          ) : (
            filteredMemos.map((ev) => (
              <li key={ev.id} className="memo_item">
                {/* ✅ 시간만 표시 (HH:MM) */}
                  [ {ev.date.slice(11, 16)} ] {ev.title}
                <button className="memo_delete_btn" onClick={() => handleDelete(ev.id)}>×</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
});

export default SidebarCalendar;