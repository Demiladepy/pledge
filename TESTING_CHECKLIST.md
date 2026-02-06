# 🧪 Pre-Submission Testing Checklist

## ✅ Core Functionality Tests

### 1. Backend Health Check
- [ ] Backend starts without errors
- [ ] Health endpoint responds: `GET http://localhost:8000/`
- [ ] System status endpoint works: `GET http://localhost:8000/api/system/status`
- [ ] All services show as connected (DB, Opik, Gemini, Blockchain)

### 2. Opik Integration
- [ ] Opik initializes successfully (check backend logs)
- [ ] Dashboard URL accessible: https://www.comet.com/opik/pledgeagent
- [ ] Traces appear in Opik dashboard after verification
- [ ] No "Opik not enabled" errors

### 3. Goal Creation
- [ ] Create goal via API/Frontend
- [ ] Goal saved to database (`pledgeagent.db`)
- [ ] Goal ID returned correctly
- [ ] Transaction hash returned (even if simulated)
- [ ] Goal appears in database query

### 4. Proof Submission
- [ ] Submit proof with valid goal_id
- [ ] Goal fetched from database (not hardcoded)
- [ ] Gemini Vision API called successfully
- [ ] Verification result returned
- [ ] Opik trace created
- [ ] Fraud detection runs
- [ ] Stake adjustment updates

### 5. Dashboard Data
- [ ] User stats endpoint returns real data
- [ ] Metrics endpoint shows Opik data (not zeros)
- [ ] Activity feed shows recent events
- [ ] No mock data fallbacks

### 6. Error Handling
- [ ] Invalid goal_id returns 404
- [ ] Missing image returns error
- [ ] Expired goal returns error
- [ ] Wrong user_id returns 403

## 🔍 Verification Steps

### Step 1: Start Backend
```bash
cd pledgeagent/backend
python -m uvicorn api.main:app --reload
```

**Expected Output:**
```
✅ Opik (Cloud) initialized - Project: pledgeagent
   Dashboard: https://www.comet.com/opik/pledgeagent
✅ Gemini Vision initialized with Opik tracing
🧠 PledgeAgent Brain initialized with full Opik observability
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Test Health Endpoint
```bash
curl http://localhost:8000/
```

**Expected:** `{"status":"operational","service":"PledgeAgent API","version":"1.0.0"}`

### Step 3: Test System Status
```bash
curl http://localhost:8000/api/system/status
```

**Expected:** All services should show status (DB connected, Opik enabled, Gemini enabled)

### Step 4: Create a Test Goal
```bash
curl -X POST http://localhost:8000/api/goals \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_123",
    "description": "Go to gym 3 times this week",
    "proof_type": "photo",
    "stake_amount": 50,
    "duration_days": 7,
    "penalty_recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'
```

**Expected:** Returns `goal_id` and `transaction_hash`

### Step 5: Verify Goal in Database
```bash
# Using Python
python -c "
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Goal
engine = create_engine('sqlite:///./pledgeagent.db')
Session = sessionmaker(bind=engine)
session = Session()
goals = session.query(Goal).all()
print(f'Found {len(goals)} goals')
for g in goals:
    print(f'  - {g.goal_id}: {g.description}')
"
```

### Step 6: Submit Proof
```bash
curl -X POST http://localhost:8000/api/proof/submit \
  -F "user_id=test_user_123" \
  -F "goal_id=goal_test_user_123_XXXXX" \
  -F "proof_image=@/path/to/test/image.jpg"
```

**Expected:** Returns verification result with verdict, confidence, reasoning

### Step 7: Check Opik Dashboard
1. Visit: https://www.comet.com/opik/pledgeagent
2. Look for traces named "proof_verification"
3. Verify trace contains:
   - Input (goal description, proof type)
   - Output (verdict, confidence)
   - Metadata (fraud_score, processing_time)

### Step 8: Check User Stats
```bash
curl http://localhost:8000/api/user/test_user_123/stats
```

**Expected:** Real stats from database (not zeros for new user, or actual data if exists)

### Step 9: Check Dashboard Metrics
```bash
curl http://localhost:8000/api/metrics/dashboard
```

**Expected:** Metrics from Opik or zeros if no data yet (but `opik_enabled: true`)

## 🚨 Common Issues & Fixes

### Issue: Backend won't start
**Check:**
- Python version (3.8+)
- All dependencies installed: `pip install -r requirements.txt`
- Environment variables set in `.env`

### Issue: Opik not logging
**Check:**
- API key in `.env`: `OPIK_API_KEY=zayYeYHhMgvjDRqMX73aqQnV7`
- Network connectivity to comet.com
- Backend logs for Opik initialization

### Issue: Database errors
**Fix:**
- Delete `pledgeagent.db` and restart backend
- Check database URL in `.env`

### Issue: Import errors
**Fix:**
- Ensure running from correct directory
- Check `sys.path` in `main.py` includes parent directory

## 📋 Submission Readiness Checklist

- [ ] All tests pass
- [ ] Opik dashboard shows traces
- [ ] No mock data in responses
- [ ] Error handling works
- [ ] Frontend connects to backend
- [ ] Documentation complete
- [ ] README updated
- [ ] Environment variables documented
- [ ] Demo video/instructions ready

## 🎯 Demo Flow for Judges

1. **Show Opik Dashboard** - "Here's our observability platform"
2. **Create Goal** - "User creates commitment"
3. **Submit Proof** - "AI verifies with Gemini Vision"
4. **Show Trace** - "Everything logged to Opik in real-time"
5. **Show Metrics** - "Dashboard shows live performance data"
