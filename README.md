# SmartFlood

도림천 침수 위험도 화면과 API를 실험하는 시제품입니다.

> 현재 API는 고정된 예시 데이터를 반환합니다. 실시간 관측 데이터와 AI 예측 모델은 연결되어 있지 않으므로 실제 재난 대응이나 안전 판단에 사용하지 마세요.

## 구성

- `backend/`: Node.js와 Express로 만든 데모 API
- `frontend-web/`: React 웹 화면
- `SmartFloodMobile/`: Kotlin과 Jetpack Compose로 만든 Android 앱

## 로컬에서 실행하기

Node.js와 npm이 필요합니다. 저장소 루트에서 각각 터미널을 열어 실행하세요.

### API 서버

```bash
cd backend
npm install
npm run dev
```

API 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다. 서버 포트를 바꾸려면 `PORT` 환경 변수를 지정할 수 있습니다.

### 웹 화면

```bash
cd frontend-web
npm install
PORT=3001 npm start
```

웹 개발 서버는 `http://localhost:3001`에서 실행되고 API 서버에는 `http://localhost:3000/api`로 요청합니다. macOS와 Linux 셸에서 사용할 수 있는 명령입니다.

### Android 앱

Android Studio에서 `SmartFloodMobile/`을 열어 실행하세요. 에뮬레이터에서 API 서버를 사용하려면 백엔드가 기본 포트 3000에서 실행 중이어야 합니다.

## 데모 API

- `GET /api/weather`: 예시 기상 값
- `GET /api/waterlevel`: 예시 수위와 유량
- `GET /api/drainage`: 예시 배수 시설 상태
- `GET /api/cctv`: 예시 CCTV 위치
- `GET /api/flood-risk`: 고정된 예시 위험도와 안내 문구

모든 응답은 `backend/server.js`에 작성된 시연용 값이며 실제 센서, 공공 API, 학습 모델의 결과가 아닙니다.
