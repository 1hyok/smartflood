import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [floodRisk, setFloodRisk] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [waterLevel, setWaterLevel] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:3001/api';

  // 침수 위험도 조회
  const checkFloodRisk = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/flood-risk?latitude=37.5089&longitude=126.8951`);
      setFloodRisk(response.data.data);
    } catch (error) {
      console.error('Error fetching flood risk:', error);
    }
    setLoading(false);
  };

  // 실시간 데이터 로드
  const loadRealtimeData = async () => {
    try {
      const [weatherRes, waterRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/weather`),
        axios.get(`${API_BASE_URL}/waterlevel`)
      ]);
      
      setWeatherData(weatherRes.data.data);
      setWaterLevel(waterRes.data.data);
    } catch (error) {
      console.error('Error fetching realtime data:', error);
    }
  };

  useEffect(() => {
    loadRealtimeData();
  }, []);

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌊 SmartFlood</h1>
        <p>서울시 도림천 침수예측 시스템</p>
      </header>

      <main className="container">
        {/* 침수 위험도 섹션 */}
        <section className="risk-section">
          <h2>현재 침수 위험도</h2>
          <button onClick={checkFloodRisk} disabled={loading} className="check-btn">
            {loading ? '조회 중...' : '위험도 확인'}
          </button>
          
          {floodRisk && (
            <div className="risk-card">
              <div 
                className="risk-level"
                style={{ backgroundColor: getRiskColor(floodRisk.riskLevel) }}
              >
                {floodRisk.riskLevel.toUpperCase()} ({floodRisk.riskScore}%)
              </div>
              <div className="predictions">
                <h3>예측</h3>
                <p>10분 후: {floodRisk.prediction.next10min}</p>
                <p>30분 후: {floodRisk.prediction.next30min}</p>
                <p>1시간 후: {floodRisk.prediction.next1hour}</p>
              </div>
              <div className="recommendations">
                <h3>권장사항</h3>
                {floodRisk.recommendations.map((rec, index) => (
                  <p key={index}>• {rec}</p>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 실시간 데이터 섹션 */}
        <section className="data-section">
          <h2>실시간 모니터링</h2>
          <div className="data-grid">
            {weatherData && (
              <div className="data-card">
                <h3>🌤️ 기상 정보</h3>
                <p>온도: {weatherData.temperature}°C</p>
                <p>습도: {weatherData.humidity}%</p>
                <p>강수량: {weatherData.rainfall}mm</p>
                <p>풍속: {weatherData.windSpeed}m/s</p>
              </div>
            )}
            
            {waterLevel && (
              <div className="data-card">
                <h3>🌊 수위 정보</h3>
                <p>수위: {waterLevel.waterLevel}m</p>
                <p>유량: {waterLevel.flowRate}㎥/s</p>
                <p>상태: {waterLevel.status}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;