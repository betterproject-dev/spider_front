const TABS = [
  {key: "ALL", label: "전체"},
  {key: "ACTIVE", label: "진행중"},
  {key: "RESOLVED", label: "완료"}
]

const NotificationTabs = ({ tab, setTab }) => {
  return (
    <div className="ntabs">
      {TABS.map( t => (
        <button
          key={t.key}
          className={`ntab ${tab === t.key ? "active" : ""}`}
          onClick={() => setTab(t.key)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export default NotificationTabs