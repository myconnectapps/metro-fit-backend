# Metro Fit — Backend API

Express.js REST API with PostgreSQL for the Metro Fit wellness application.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your PostgreSQL credentials
cp .env.example .env

# 3. Run database migration
npm run migrate

# 4. Start development server
npm run dev
```

Server starts on `http://localhost:3001`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/wellness-profile` | Save wellness profile |
| GET | `/api/wellness-profile/:userId` | Get wellness profile |

### POST `/api/wellness-profile`

**Request body:**
```json
{
  "userId": "user-123",
  "currentWeight": 80,
  "targetWeight": 70,
  "stepTarget": 10000,
  "activeMinutes": 30
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "profile": { ... },
    "stats": {
      "weightDeltaKg": 10,
      "estimatedDailyCalorieBurn": 150,
      "weeklyStepGoal": 70000
    }
  }
}
```

## Running Tests

```bash
npm test
```
