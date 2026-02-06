# 🚀 Hackathon Submission Guide

## Quick Start Testing

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

### Step 2: Run Test Suite
In a **new terminal**:
```bash
cd pledgeagent/backend
python test_submission.py
```

This will test:
- ✅ Backend health
- ✅ System status (DB, Opik, Gemini, Blockchain)
- ✅ Goal creation
- ✅ User stats
- ✅ Dashboard metrics
- ✅ Proof submission
- ✅ Error handling

### Step 3: Manual Verification

#### Check Opik Dashboard
1. Visit: https://www.comet.com/opik/pledgeagent
2. Look for traces named "proof_verification"
3. Verify you see:
   - Input data (goal description, proof type)
   - Output data (verdict, confidence)
   - Metadata (fraud_score, processing_time)

#### Test Goal Creation via API
```bash
curl -X POST http://localhost:8000/api/goals \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "demo_user",
    "description": "Go to gym 3 times this week",
    "proof_type": "photo",
    "stake_amount": 50,
    "duration_days": 7,
    "penalty_recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'
```

#### Check Database
```bash
# Using Python
python -c "
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
sys.path.insert(0, 'pledgeagent/backend')
from models import Goal
engine = create_engine('sqlite:///./pledgeagent.db')
Session = sessionmaker(bind=engine)
session = Session()
goals = session.query(Goal).all()
print(f'Found {len(goals)} goals')
for g in goals:
    print(f'  - {g.goal_id}: {g.description[:50]}')
"
```

## 📋 Pre-Submission Checklist

### Core Functionality
- [ ] Backend starts without errors
- [ ] Health endpoint responds
- [ ] System status shows all services connected
- [ ] Goal creation works and saves to database
- [ ] Proof submission works with real goal data
- [ ] Opik traces appear in dashboard

### Opik Integration (CRITICAL FOR HACKATHON)
- [ ] Opik API key configured: `zayYeYHhMgvjDRqMX73aqQnV7`
- [ ] Opik dashboard accessible: https://www.comet.com/opik/pledgeagent
- [ ] Traces appear after proof submission
- [ ] Each verification creates a trace with:
  - Input (goal description, proof type)
  - Output (verdict, confidence, reasoning)
  - Metadata (fraud_score, processing_time)
  - Tags (verdict, confidence_tier, personality)

### Data Quality
- [ ] No mock data in API responses
- [ ] User stats come from database
- [ ] Dashboard metrics come from Opik (or show zeros if no data)
- [ ] Activity feed shows real events

### Error Handling
- [ ] Invalid goal_id returns 404
- [ ] Missing image returns error
- [ ] Expired goal returns error
- [ ] Wrong user_id returns 403

### Documentation
- [ ] README.md updated
- [ ] Environment variables documented
- [ ] Setup instructions clear
- [ ] Demo flow documented

## 🎯 Demo Flow for Judges

### 1. Show Opik Dashboard (30 seconds)
- "This is our observability platform - Opik"
- "Every AI decision is logged here in real-time"
- Show traces with input/output/metadata

### 2. Create Goal (30 seconds)
- "User creates a commitment"
- Show goal creation via frontend/API
- Point out goal saved to database

### 3. Submit Proof (1 minute)
- "User submits proof image"
- "AI analyzes with Gemini Vision"
- "Fraud detection runs"
- "Decision rendered"
- Show result with confidence and reasoning

### 4. Show Trace in Opik (30 seconds)
- "Everything logged to Opik"
- Show the trace with all details
- Point out tags, metadata, processing time

### 5. Show Dashboard Metrics (30 seconds)
- "Real-time performance metrics"
- Show success rate, active goals, etc.
- Emphasize: "No mock data - all real"

**Total Demo Time: ~3 minutes**

## 🔧 Troubleshooting

### Backend Won't Start
**Check:**
- Python 3.8+ installed
- Dependencies: `pip install -r requirements.txt`
- Environment variables in `.env`:
  - `OPIK_API_KEY=zayYeYHhMgvjDRqMX73aqQnV7`
  - `GOOGLE_API_KEY=AIzaSyBy3Dqc2iIbEtwlMsMxqBD8l4rpO1wqBPY`
  - `DATABASE_URL=sqlite:///./pledgeagent.db`

### Opik Not Logging
**Check:**
- API key is correct
- Network connectivity to comet.com
- Backend logs show "Opik (Cloud) initialized"
- Check Opik dashboard URL

### Database Errors
**Fix:**
- Delete `pledgeagent.db` and restart backend
- Tables will be auto-created

### Import Errors
**Fix:**
- Ensure running from correct directory
- Check `sys.path` in `main.py`

## 📊 Key Features to Highlight

1. **Full Opik Integration** - Every verification traced
2. **Real-time Data** - No mock data, all from database/Opik
3. **Gemini Vision AI** - Image verification with confidence scores
4. **Fraud Detection** - Pattern matching and learning
5. **Smart Contract Ready** - Blockchain integration prepared
6. **Adaptive Behavior** - Stake adjustment based on user patterns

## 🎉 Ready for Submission!

Once all tests pass:
1. ✅ Run test suite: `python test_submission.py`
2. ✅ Verify Opik dashboard shows traces
3. ✅ Test frontend integration
4. ✅ Prepare demo video/screenshots
5. ✅ Submit!

Good luck! 🚀
