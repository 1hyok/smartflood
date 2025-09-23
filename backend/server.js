const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 테스트 라우트
app.get('/', (req, res) => {
  res.json({ message: 'SmartFlood API Server is running!' });
});

// 기상 데이터 API
app.get('/api/weather', (req, res) => {
  res.json({ 
    message: 'Weather data endpoint',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});