import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/SidebarCalendar.css";
import {memo, useCallback, useEffect, useMemo, useState} from "react";
import requestHandler from "../../../utils/requestHandler";

const SidebarCalendar = memo(() => {
  const [events, setEvents] = useState([]);
  const [currentYearMonth, setCurrentYearMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(null);

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

  useEffect(() => {
    loadNotionMemos();
  }, [loadNotionMemos]);

  // 달력 월 바뀔 때
  const handleDatesSet = useCallback((dateInfo) => {
    const midDate = new Date(
      dateInfo.start.getTime() + (dateInfo.end.getTime() - dateInfo.start.getTime()) / 2
    );
    const yyyymm = midDate.toISOString().slice(0, 7);
    setCurrentYearMonth(yyyymm);
  }, []);

  // 날짜 클릭
  const handleDateClick = useCallback((arg) => {
    setSelectedDate(arg.dateStr);
  }, []);

  // 메모 추가 (오늘만)
  const handleAddMemo = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const dateStr = selectedDate || today;

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

  // 메모 삭제
  const handleDelete = useCallback(
    async (id) => {
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

  // ✅ 선택된 날짜의 메모만 보여주기
  const filteredMemos = useMemo(() => {
    if (!selectedDate) return [];
    return events
      .filter((ev) => ev.date.startsWith(selectedDate))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events, selectedDate]);

  // ✅ 캘린더에 찍을 이벤트는 "날짜당 1개 점"으로 압축
  const calendarEvents = useMemo(() => {
    const map = new Map();

    events.forEach((ev) => {
      const day = ev.date.slice(0, 10); // YYYY-MM-DD
      if (!map.has(day)) {
        map.set(day, {
          id: `dot-${day}`,
          start: day,
          allDay: true,
          display: "block",
          classNames: ["memo-dot-event"],
        });
      }
    });

    return Array.from(map.values());
  }, [events]);

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
          dayCellClassNames={(arg) => {
            const y = arg.date.getFullYear();
            const m = String(arg.date.getMonth() + 1).padStart(2, "0");
            const d = String(arg.date.getDate()).padStart(2, "0");
            const ymd = `${y}-${m}-${d}`; // ✅ 로컬 기준 YYYY-MM-DD

            return ymd === selectedDate ? ["fc-day-selected"] : [];
          }}
          datesSet={handleDatesSet}
          events={calendarEvents} // ✅ 날짜당 1개 점만 표시
          eventContent={() => ({html: '<span class="memo-dot"></span>'})} // ✅ 텍스트 대신 점만
          dayHeaderFormat={{weekday: "short"}}
          dayCellContent={(args) => args.dayNumberText.replace("일", "")}
        />
      </div>

      <div className="memo_summary">
        <p className="summary_title">
          {selectedDate ? `${selectedDate} 일지` : "최근 일지 기록 (Notion)"}
          <button className="memo_add_btn" onClick={handleAddMemo}>
            +
          </button>
        </p>

        <ul className="summary_list">
          {!selectedDate ? (
            <li className="empty_msg" style={{textAlign: "center", padding: "20px 0"}}>
              📅 날짜를 선택해 주세요
            </li>
          ) : filteredMemos.length === 0 ? (
            <li className="empty_msg" style={{textAlign: "center", padding: "20px 0"}}>
              메모가 없습니다
            </li>
          ) : (
            filteredMemos.map((ev) => (
              <li key={ev.id} className="memo_item">
                [{ev.date.slice(11, 16)}] {ev.title}
                <button className="memo_delete_btn" onClick={() => handleDelete(ev.id)}>
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
});

export default SidebarCalendar;
