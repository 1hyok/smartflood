import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './components/Map';
import './App.css';

function App() {
  const [floodRisk, setFloodRisk] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [waterLevel, setWaterLevel] = useState(null);
  const [cctvData, setCctvData] = useState(null);
  const [drainageData, setDrainageData] = useState(null);
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
      const [weatherRes, waterRes, cctvRes, drainageRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/weather`),
        axios.get(`${API_BASE_URL}/waterlevel`),
        axios.get(`${API_BASE_URL}/cctv`),
        axios.get(`${API_BASE_URL}/drainage`)
      ]);
      
      setWeatherData(weatherRes.data.data);
      setWaterLevel(waterRes.data.data);
      setCctvData(cctvRes.data.data);
      setDrainageData(drainageRes.data.data);
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return '#28a745';
      case 'caution': return '#ffc107';
      case 'warning': return '#fd7e14';
      case 'danger': return '#dc3545';
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
                <p>10분 후: <span style={{color: getRiskColor(floodRisk.prediction.next10min)}}>{floodRisk.prediction.next10min}</span></p>
                <p>30분 후: <span style={{color: getRiskColor(floodRisk.prediction.next30min)}}>{floodRisk.prediction.next30min}</span></p>
                <p>1시간 후: <span style={{color: getRiskColor(floodRisk.prediction.next1hour)}}>{floodRisk.prediction.next1hour}</span></p>
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

        {/* 지도 섹션 */}
        <section className="map-section">
          <h2>📍 모니터링 지역</h2>
          <Map cctvData={cctvData} />
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
                <small>업데이트: {new Date(weatherData.timestamp).toLocaleTimeString()}</small>
              </div>
            )}
            
            {waterLevel && (
              <div className="data-card">
                <h3>🌊 수위 정보</h3>
                <p>수위: {waterLevel.waterLevel}m</p>
                <p>유량: {waterLevel.flowRate}㎥/s</p>
                <p>상태: <span style={{color: getStatusColor(waterLevel.status)}}>{waterLevel.status}</span></p>
                <small>업데이트: {new Date(waterLevel.timestamp).toLocaleTimeString()}</small>
              </div>
            )}
          </div>
        </section>

        {/* 하수관거 현황 */}
        <section className="drainage-section">
          <h2>🚰 하수관거 현황</h2>
          <div className="drainage-grid">
            {drainageData && drainageData.map((drain) => (
              <div key={drain.id} className="drainage-card">
                <h4>{drain.location}</h4>
                <p>관경: {drain.pipeSize}mm</p>
                <p>상태: <span style={{color: getStatusColor(drain.status)}}>{drain.status}</span></p>
                <p>점검일: {drain.lastInspection}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;