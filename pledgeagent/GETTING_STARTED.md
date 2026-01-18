# Getting Started with PledgeAgent

## Import to VSCode

1. **Download the project:**
   - You should have received a `pledgeagent.zip` file
   - Extract it to your desired location

2. **Open in VSCode:**
   ```bash
   cd pledgeagent
   code .
   # Or double-click pledgeagent.code-workspace
   ```

3. **Recommended Extensions:**
   VSCode will prompt you to install recommended extensions. Click "Install All".

## Environment Setup

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
```

**Edit `.env` with your keys:**
```bash
OPENAI_API_KEY=sk-...              # Required
OPIK_API_KEY=...                   # Optional (for logging)
DATABASE_URL=postgresql://...       # Or use SQLite for testing
```

### 2. Database Setup

**Option A: PostgreSQL (Production)**
```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql
# Windows: Download from postgresql.org

# Create database
createdb pledgeagent

# Update .env with connection string
DATABASE_URL=postgresql://user:password@localhost:5432/pledgeagent
```

**Option B: SQLite (Quick Testing)**
```bash
# In .env
DATABASE_URL=sqlite:///./pledgeagent.db
```

### 3. Start Backend

```bash
cd backend
source venv/bin/activate
python api/main.py
```

Backend runs at: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

### 4. Test Backend

```bash
# In a new terminal
curl http://localhost:8000/

# Should return:
# {"status":"operational","service":"PledgeAgent API","version":"1.0.0"}
```

## Quick Test

### Test Verification System

```bash
cd backend
source venv/bin/activate
python tests/test_verification.py
```

This validates your OpenAI API key works.

### Submit Test Proof (with curl)

```bash
# Create a test image (or use your own)
curl -X POST http://localhost:8000/api/proof/submit \
  -F "user_id=test_user_123" \
  -F "goal_id=test_goal_456" \
  -F "proof_image=@/path/to/gym_photo.jpg"
```

## Project Structure Quick Reference

```
pledgeagent/
├── backend/
│   ├── agent/              # Core AI logic
│   │   ├── brain.py        # Main orchestrator
│   │   ├── verification.py # Vision AI
│   │   ├── fraud_detector.py
│   │   └── stake_adjuster.py
│   ├── api/
│   │   └── main.py         # FastAPI server ← START HERE
│   └── requirements.txt
├── contracts/
│   └── PledgeEscrow.sol    # Smart contract
└── README.md               # Full documentation
```

## Development Workflow

### 1. Make Changes

Edit files in VSCode. The workspace is configured for:
- Auto-formatting on save
- Linting
- Import organization

### 2. Test Changes

```bash
# Backend tests
cd backend
pytest

# Or test specific component
python tests/test_verification.py
```

### 3. Run Backend

```bash
cd backend
uvicorn api.main:app --reload
```

`--reload` auto-restarts on file changes.

## Common Issues

### "OPENAI_API_KEY not found"
- Make sure you created `.env` in `backend/` directory
- Verify the key starts with `sk-`
- Check you activated the virtual environment

### "Module not found"
```bash
# Make sure you're in venv
source backend/venv/bin/activate

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### "Database connection failed"
- For SQLite: just change DATABASE_URL to `sqlite:///./pledgeagent.db`
- For PostgreSQL: verify service is running

### Port 8000 already in use
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn api.main:app --port 8001
```

## Next Steps

1. **Read the full README.md** for architecture details
2. **Check out the API docs** at `http://localhost:8000/docs`
3. **Explore `agent/brain.py`** to see decision logic
4. **Test fraud detection** with duplicate images
5. **Add Opik key** to see full observability

## Smart Contract Deployment (Optional)

```bash
cd contracts
npm install
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network base-sepolia
```

## Need Help?

- **API Issues:** Check `http://localhost:8000/docs`
- **Python Errors:** Verify virtual environment is activated
- **General Questions:** Read README.md
- **Bugs:** Check the code comments for TODOs

---

**Pro Tip:** Keep the API docs open while developing: `http://localhost:8000/docs`

You can test all endpoints directly from the Swagger UI!
