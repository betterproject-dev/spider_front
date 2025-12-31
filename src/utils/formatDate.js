export const formatDateTime = (iso) => {
  if (!iso) return "-"

  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso

  return d.toLocaleString("ko-KR", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}