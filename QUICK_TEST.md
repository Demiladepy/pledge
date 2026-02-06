# ⚡ Quick Test - 5 Minutes to Verify Everything

## Step 1: Start Backend (Terminal 1)
```bash
cd pledgeagent/backend
python -m uvicorn api.main:app --reload
```

**Wait for:** `INFO:     Uvicorn running on http://0.0.0.0:8000`

## Step 2: Run Tests (Terminal 2)
```bash
cd pledgeagent/backend
python test_submission.py
```

**Expected:** All tests pass (or at least 5/7)

## Step 3: Quick Manual Checks

### ✅ Check 1: Health Endpoint
Open browser: http://localhost:8000/

**Should see:** `{"status":"operational","service":"PledgeAgent API","version":"1.0.0"}`

### ✅ Check 2: System Status
Open browser: http://localhost:8000/api/system/status

**Should see:**
- `database_connected: true`
- `opik_enabled: true`
- `gemini_enabled: true`
- `opik_dashboard_url: "https://www.comet.com/opik/pledgeagent"`

### ✅ Check 3: Opik Dashboard
Open: https://www.comet.com/opik/pledgeagent

**Should see:** Project dashboard (may be empty until you submit proofs)

### ✅ Check 4: Create a Goal
Use frontend or:
```bash
curl -X POST http://localhost:8000/api/goals \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","description":"Test goal","proof_type":"photo","stake_amount":50,"duration_days":7,"penalty_recipient":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

**Should return:** `goal_id` and `transaction_hash`

### ✅ Check 5: Database Has Goal
```bash
# Check if goals table exists and has data
python -c "from sqlalchemy import create_engine, inspect; e=create_engine('sqlite:///./pledgeagent.db'); print('Tables:', inspect(e).get_table_names())"
```

## 🎯 What to Look For

### ✅ GOOD Signs:
- Backend starts without errors
- Opik shows "initialized" in logs
- System status shows all services connected
- Goals save to database
- Opik dashboard accessible

### ❌ BAD Signs:
- Import errors
- "Opik not enabled" messages
- Database connection errors
- All zeros in metrics (if you've submitted proofs)

## 🚨 If Tests Fail

1. **Backend not running:** Start it first (Step 1)
2. **Opik not enabled:** Check `.env` has `OPIK_API_KEY=zayYeYHhMgvjDRqMX73aqQnV7`
3. **Database errors:** Delete `pledgeagent.db` and restart
4. **Import errors:** Check you're in the right directory

## ✅ Ready When:
- [ ] Backend starts successfully
- [ ] All 7 tests pass (or 5+)
- [ ] Opik dashboard accessible
- [ ] Can create goals
- [ ] Can submit proofs
- [ ] Traces appear in Opik

## 📝 Next Steps After Tests Pass:
1. Test frontend integration
2. Create demo video
3. Prepare submission materials
4. Submit!
