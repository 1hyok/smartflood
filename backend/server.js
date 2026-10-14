const express = require('express');
const cors = require('cors');
const axios = require('axios');
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

// 1. 기상 예시 데이터를 반환하는 시연용 API
app.get('/api/weather', async (req, res) => {
  try {
    // 임시 더미 데이터 (실제 API 키 발급 전까지)
    const weatherData = {
      location: "도림천",
      temperature: 23.5,
      humidity: 65,
      rainfall: 2.3,
      windSpeed: 4.2,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. 수위 예시 데이터를 반환하는 시연용 API
app.get('/api/waterlevel', async (req, res) => {
  try {
    const waterData = {
      location: "도림천",
      waterLevel: 1.2,
      flowRate: 15.7,
      status: "normal", // normal, caution, warning, danger
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: waterData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. 배수 시설 예시 데이터를 반환하는 시연용 API
app.get('/api/drainage', async (req, res) => {
  try {
    const drainageData = [
      {
        id: 1,
        location: "구로구 도림동",
        pipeSize: 1200,
        status: "normal",
        lastInspection: "2025-09-01"
      },
      {
        id: 2,
        location: "영등포구 도림동",
        pipeSize: 1000,
        status: "caution",
        lastInspection: "2025-09-15"
      }
    ];
    
    res.json({
      success: true,
      data: drainageData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. CCTV 위치 예시를 반환하는 시연용 API
app.get('/api/cctv', async (req, res) => {
  try {
    const cctvData = [
      {
        id: 1,
        name: "도림천교 CCTV",
        latitude: 37.5089,
        longitude: 126.8951,
        status: "active"
      },
      {
        id: 2,
        name: "도림천 상류 CCTV",
        latitude: 37.5102,
        longitude: 126.8965,
        status: "active"
      }
    ];
    
    res.json({
      success: true,
      data: cctvData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. 고정된 침수 위험도 예시를 반환하는 API
app.get('/api/flood-risk', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    // 시연용 더미 데이터이며 AI 모델의 예측 결과가 아님
    const riskData = {
      location: { latitude: latitude || 37.5089, longitude: longitude || 126.8951 },
      riskLevel: "low", // low, medium, high, critical
      riskScore: 25, // 0-100
      prediction: {
        next10min: "low",
        next30min: "medium",
        next1hour: "medium"
      },
      recommendations: [
        "현재 안전합니다",
        "30분 후 주의 필요"
      ],
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: riskData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
