import "../styles/MonitoringMain.css";
import { memo } from 'react';
import UseCurrentTime from '../../../hooks/UseCurrentTime';

const DigitalClock = memo(() => {
  const { formattedDate, dayName, time } = UseCurrentTime();

  return (
    <div className="clock">
      <p className="date">{formattedDate}</p>
      <p className="todayweek">{dayName}</p>
      <p className="time">{time}</p>
    </div>
  );
});

export default DigitalClock;