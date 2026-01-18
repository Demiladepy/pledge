# Running PledgeAgent End-to-End

This guide shows how to run the complete PledgeAgent system (backend + frontend) together.

## Prerequisites

- Python 3.9+
- Node.js 18+
- OpenAI API key (optional, for live verification)
- Two terminal windows

## Backend Setup (Terminal 1)

### 1. Navigate to backend
```bash
cd pledgeagent/backend
```

### 2. Create Python virtual environment (first time only)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Create .env file (if needed for OpenAI key)
```bash
# .env
OPENAI_API_KEY=sk-...  # Your API key
```

### 5. Start the backend server
```bash
python api/main.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ Backend is now running at `http://localhost:8000`

The API documentation is at `http://localhost:8000/docs` (Swagger UI)

## Frontend Setup (Terminal 2)

### 1. Navigate to frontend
```bash
cd pledgeagent/frontend
```

### 2. Install dependencies (first time only)
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

✅ Frontend is now running at `http://localhost:3000`

## Testing the Full System

### 1. Open Frontend
Go to `http://localhost:3000` in your browser

### 2. Create a Goal

1. Click "Create Goal" or "Get Started"
2. Fill in the form:
   - **Goal Description**: "Complete my workout routine"
   - **Stake Amount**: 50 (USD)
   - **Duration**: 30 (days)
3. Click "Create Goal & Lock Stake"
4. Copy the `Goal ID` and `User ID` (you'll need them)

Expected Result:
- ✅ Goal created successfully
- ✅ Stake is "locked"
- ✅ Success confirmation with IDs

### 3. Submit Proof

1. Click "Submit Proof" from the success screen
2. Upload an image as proof (any image file works for testing)
3. Paste the `Goal ID` and `User ID` from previous step
4. Click "Submit for Verification"
5. Wait for AI verification (~2-5 seconds)

Expected Result:
- ✅ AI processes the image
- ✅ Shows verdict: APPROVED or REJECTED
- ✅ Displays confidence score
- ✅ Shows any fraud signals detected

### 4. Check Dashboard

1. Click "View Dashboard"
2. If prompted, paste your User ID
3. Click "Load User"

Expected Result:
- ✅ Shows total goals
- ✅ Shows approved/rejected count
- ✅ Displays success rate
- ✅ Shows current streak
- ✅ Shows total stake locked

## API Testing (via Swagger UI)

### Access API Docs
Open `http://localhost:8000/docs` in your browser

### Test Endpoints

#### 1. Create Goal
```
POST /api/goals

Request body:
{
  "goal_id": "goal_test123",
  "user_id": "user_test123",
  "description": "Test goal creation",
  "stake_amount": 50,
  "duration_days": 30
}

Response:
{
  "goal_id": "goal_test123",
  "user_id": "user_test123",
  "message": "Goal created successfully",
  "stake_locked": 50
}
```

#### 2. Submit Proof
```
POST /api/proof/submit

Form data:
- goal_id: goal_test123
- user_id: user_test123
- image_file: [select image file]

Response:
{
  "verdict": "APPROVED",
  "confidence": 0.92,
  "message": "Image matches goal...",
  "fraud_signals": [],
  "recommendation": "Great work!"
}
```

#### 3. Get User Stats
```
GET /api/user/user_test123/stats

Response:
{
  "user_id": "user_test123",
  "total_goals": 1,
  "approved_count": 1,
  "rejected_count": 0,
  "approval_rate": 1.0,
  "total_stake_locked": 50,
  "current_streak": 1,
  "personality_mode": "encouraging"
}
```

#### 4. Get Metrics
```
GET /api/metrics/dashboard

Response:
{
  "total_verifications": 1,
  "approval_rate": 1.0,
  "fraud_detection_rate": 0.0,
  "average_confidence": 0.92,
  "active_users": 1,
  "total_stake_locked": 50
}
```

## Monitoring & Debugging

### Frontend Console (Browser DevTools)
Press `F12` or right-click → Inspect

- **Console Tab** - See logs, errors
- **Network Tab** - See API calls (should be to http://localhost:8000)
- **Application Tab** - Check localStorage (User IDs stored here)

### Backend Logs (Terminal with Backend)
- Shows API requests
- Shows errors
- Shows agent decision-making info

Example:
```
INFO:     127.0.0.1:54321 - "POST /api/goals HTTP/1.1" 200 OK
INFO:     127.0.0.1:54321 - "POST /api/proof/submit HTTP/1.1" 200 OK
```

## Common Issues

### ❌ "Connection refused" on Frontend
**Problem:** Backend not running
**Solution:** 
```bash
# Terminal 1
cd backend
python api/main.py
```

### ❌ "CORS error" in browser console
**Problem:** Backend CORS not configured properly
**Solution:** Check `backend/api/main.py` has CORS enabled:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### ❌ "OpenAI API error"
**Problem:** API key missing or invalid
**Solution:**
```bash
# Set environment variable
export OPENAI_API_KEY=sk-...  # macOS/Linux
set OPENAI_API_KEY=sk-...     # Windows

# Or create .env file in backend
echo "OPENAI_API_KEY=sk-..." > backend/.env
```

### ❌ Image upload fails
**Problem:** File too large or invalid format
**Solution:** 
- Use JPG/PNG images
- Keep file size under 10MB
- Check frontend console for exact error

## Development Workflow

### For Frontend Development

1. Edit a component in `frontend/src/`
2. Browser automatically refreshes (hot reload)
3. Check results immediately
4. No need to restart anything

### For Backend Development

1. Edit a file in `backend/`
2. Backend automatically restarts (if using reload mode)
3. Check logs in terminal
4. May need to refresh frontend to see new data

### Testing Changes

1. Make a change (frontend or backend)
2. Test in browser UI
3. Check Network tab for API calls
4. Check browser console for errors
5. Check backend logs for issues

## Building for Production

### Frontend
```bash
cd pledgeagent/frontend
npm run build

# Creates optimized dist/ folder
# ~116 KB gzipped (production ready)
```

### Backend
```bash
# No build needed - Python runs directly
# For deployment, use production server:
pip install gunicorn
gunicorn -w 4 backend.api.main:app
```

## Full Restart

If something goes wrong:

**Terminal 1 (Backend):**
```bash
# Ctrl+C to stop
cd pledgeagent/backend
python api/main.py
```

**Terminal 2 (Frontend):**
```bash
# Ctrl+C to stop
cd pledgeagent/frontend
npm run dev
```

## Useful Links

| Resource | URL |
|----------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |
| **API Redoc** | http://localhost:8000/redoc |

## Next Steps

Once you have both running:

1. ✅ **Test basic flow** - Create goal → Submit proof → Check dashboard
2. ✅ **Monitor API** - Watch Network tab while using app
3. ✅ **Check logs** - See what's happening in backend
4. ✅ **Experiment** - Try different goal descriptions, images
5. ✅ **Explore code** - Read how components call API
6. ✅ **Modify** - Change styling, add features
7. ✅ **Deploy** - When ready, build and deploy both services

## Support

- **Frontend issues?** → Check `frontend/README.md` and `frontend/DEVELOPMENT.md`
- **Backend issues?** → Check `backend/README.md` and `backend/PROJECT_OVERVIEW.md`
- **API issues?** → Try `/docs` endpoint for interactive testing
- **Image upload?** → Use drag-and-drop or click to select
- **Verification?** → Check that OpenAI key is set (if not, use mock mode)

---

**You're all set! The PledgeAgent system is ready to use end-to-end.** 🚀
