import { useState, useEffect, memo } from "react";
import "./MessageSlider.css";

/**
 * MessageSlider 컴포넌트
 * @param {Array<{machine: string, text: string}>} messages - 메시지 배열
 * @param {number} rowHeight - 한 줄 높이(px)
 * @param {number} interval - 슬라이드 간격(ms)
 */
const MessageSlider = memo(({ messages, rowHeight = 35, interval = 3500 }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);

  useEffect(() => {
    const ticker = setInterval(() => {
      setMessageIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(ticker);
  }, [interval]);

  const handleMessageTransitionEnd = () => {
    if (messageIndex === messages.length) {
      setTransitionOn(false);
      setMessageIndex(0);
      setTimeout(() => setTransitionOn(true), 50);
    }
  };

  return (
    <div className="monitor_message">
      <div className="message_left">
        <p>Message</p>
      </div>
      <div className="message_right">
        <div className="message_slider">
          <div
            className="message_track"
            style={{
              transform: `translateY(-${messageIndex * rowHeight}px)` ,
              transition: transitionOn ? "transform 0.45s ease-in-out" : "none",
            }}
            onTransitionEnd={handleMessageTransitionEnd}
          >
            {[...messages, messages[0]].map((msg, idx) => (
              <div className="message_item" key={`${msg.machine}-${idx}`}>
                <div className={`machine_num ${msg.status}`}>{msg.machine}</div>
                <div className="message_text">{msg.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default MessageSlider;
