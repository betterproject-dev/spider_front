import "../styles/defectItem.css"

const DefectlogCard = ({ log }) => {
    const text = []
    if (log.crushed) text.push("Crushed")
    if (log.discolored) text.push("Discolored")
    if (log.label) text.push("Label")
    if (log.weight) text.push("Weight")
    return (
        <div className="defect-log-card">
            <div className="card-image">
                <img src={'http://localhost:5000' + log.imageUrl} alt="Defect" />
            </div>
            <div className="card-content">
                <span className="card-id">ID: {log.id}</span>
                <span className="card-date">
                    {new Intl.DateTimeFormat('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // 24시간제 (true로 바꾸면 오전/오후 표시)
                    }).format(new Date(log.createdAt))}
                </span>
                <p className="card-text">
                    {text.length > 0 ? text.join(", ") : "Normal"}
                </p>
            </div>
        </div>
    )
}
export default DefectlogCard