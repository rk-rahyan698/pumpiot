# Express Backend

This backend serves the ESP32-S3 IoT dashboard with in-memory device state.

## API
- `GET /api/device/:id`
- `POST /api/device/:id/on`
- `POST /api/device/:id/off`

## Run
```bash
cd backend
npm install
npm start
```

## Notes
- State is stored in memory only.
- The structure is ready for a future MQTT integration.
