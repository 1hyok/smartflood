import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 마커 아이콘 문제 해결
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ cctvData }) => {
  const center = [37.5089, 126.8951]; // 도림천 중심

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* 도림천 중심점 */}
        <Marker position={center}>
          <Popup>
            <strong>📍 도림천</strong><br />
            침수 모니터링 지역
          </Popup>
        </Marker>

        {/* CCTV 위치들 */}
        {cctvData && cctvData.map((cctv) => (
          <Marker key={cctv.id} position={[cctv.latitude, cctv.longitude]}>
            <Popup>
              <strong>📹 {cctv.name}</strong><br />
              상태: {cctv.status === 'active' ? '🟢 정상' : '🔴 오류'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;