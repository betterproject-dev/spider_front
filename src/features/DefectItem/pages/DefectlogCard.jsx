import { formatDateTime } from "../../../utils/formatDate"
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
                    {formatDateTime(log.createdAt)}
                </span>
                <p className="card-text">
                    {text.length > 0 ? text.join(", ") : "Normal"}
                </p>
            </div>
        </div>
    )
}
export default DefectlogCard