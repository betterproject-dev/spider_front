// 임시 WebSocket 센서 서버 (Node.js)
// 설치: npm install ws
// 실행: node ws-sensor-server.cjs

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080, path: '/ws/sensor' });

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  // 1초마다 임의의 온도/습도 데이터 전송
  const interval = setInterval(() => {
    const data = {
      temperature: (20 + Math.random() * 10).toFixed(1), // 20~30도
      humidity: (40 + Math.random() * 20).toFixed(1)     // 40~60%
    };
    ws.send(JSON.stringify(data));
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

console.log('WebSocket sensor server running on ws://localhost:8080/ws/sensor');
