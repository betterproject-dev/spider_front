import "../styles/defectItem.css"

const DefectlogCard = () => {
    return (
        <div className="defect-log-card">
            <div className="card-image">
                <img src={""} alt="Defect" />
            </div>
            <div className="card-content">
                <span className="card-id">ID: {1}</span>
                <span className="card-date">{"2025-01-01"}</span>
                <p className="card-text">{3}</p>
            </div>
        </div>
    )
}
export default DefectlogCard