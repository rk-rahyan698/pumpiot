# ESP32-S3 IoT Dashboard

A modern React + Vite + TypeScript dashboard for controlling an ESP32-S3 pump device.

The repository now includes a separate Express backend in `backend/` for REST device control.

## Tech Stack
- React
- Vite
- TypeScript
- Material UI
- Axios

## Features
- Dark mode UI
- Responsive single-device dashboard
- Pump ON/OFF controls
- Loading state during API requests
- Success and error feedback
- Clean, scalable folder structure

## Development
1. Install dependencies
2. Run the dev server with `npm run dev`
3. Build with `npm run build`

## API
- `POST http://localhost:3000/api/device/pump001/on`
- `POST http://localhost:3000/api/device/pump001/off`

## Backend
- `GET /api/device/:id`
- `POST /api/device/:id/on`
- `POST /api/device/:id/off`
- Run it from `backend/` with `npm start`
