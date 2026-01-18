# PledgeAgent

**An adversarial AI agent that enforces New Year's resolutions through financial stakes and multimodal proof verification.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with OpenAI](https://img.shields.io/badge/Built%20with-OpenAI-412991.svg)](https://openai.com)
[![Deployed on Base](https://img.shields.io/badge/Deployed%20on-Base-0052FF.svg)](https://base.org)

## 🎯 What Is This?

92% of New Year's resolutions fail by February. Not because people don't want to change—but because there's no enforcement.

PledgeAgent is different. It doesn't remind you. It doesn't encourage you. **It judges you.**

### How It Works

1. **Lock money in a smart contract** - Your stake is held in escrow on Base L2
2. **Submit proof of progress** - Photos, screenshots, or API data
3. **AI agent verifies** - GPT-4o Vision + fraud detection + behavioral analysis
4. **Succeed or lose** - Get your money back, or it goes to charity (or your enemy)

### What Makes It Special

- 🧠 **Learning System** - Fraud detection improves with every attempt
- 🎭 **Adaptive Behavior** - Agent adjusts personality based on your patterns
- 🔍 **Full Observability** - Every decision logged to Opik with reasoning
- 💰 **Real Stakes** - Blockchain-enforced accountability
- 🤖 **Autonomous** - Makes decisions without human oversight

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (React + Vite + Tailwind)
│  localhost  │
│    :3000    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│           FastAPI Backend                    │
│              localhost:8000                  │
│  ┌─────────────────────────────────────┐   │
│  │      Agent Brain (Orchestrator)      │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │  GPT-4o Vision Verification  │   │   │
│  │  └──────────────────────────────┘   │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │   Fraud Pattern Detector     │   │   │
│  │  └──────────────────────────────┘   │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │   Behavioral Stake Adjuster  │   │   │
│  │  └──────────────────────────────┘   │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │      Opik Logger             │   │   │
│  │  └──────────────────────────────┘   │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │   Web3 Contract Interface           │   │
│  └─────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │  Smart Contract  │
         │  PledgeEscrow    │
         │   Base Network   │
         └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** - Backend runtime
- **Node.js 18+** - Frontend & contract deployment
- **PostgreSQL** - Database (optional for MVP)
- **OpenAI API Key** - For GPT-4o Vision
- **Opik API Key** - For observability (optional)
- **Base Sepolia ETH** - For testnet deployment ([Get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/pledgeagent.git
cd pledgeagent
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your API keys:
# - OPENAI_API_KEY
# - OPIK_API_KEY (optional)
# - DATABASE_URL (optional for MVP)

# Start server
python api/main.py
```

✅ Backend runs on `http://localhost:8000`  
📖 API docs available at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start dev server
npm run dev
```

✅ Frontend runs on `http://localhost:3000`

### 4. Smart Contract Deployment

```bash
cd contracts

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with:
# - PRIVATE_KEY (deployment wallet)
# - AGENT_BACKEND_ADDRESS
# - PLATFORM_TREASURY_ADDRESS

# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Base Sepolia testnet
npm run deploy:base-sepolia
```

✅ Contract deployed! Copy the address to `backend/.env`

📖 **See [contracts/DEPLOYMENT.md](contracts/DEPLOYMENT.md) for detailed deployment guide**

### 5. Test End-to-End

1. **Start all services:**
   - Terminal 1: `cd backend && python api/main.py`
   - Terminal 2: `cd frontend && npm run dev`

2. **Create a goal:**
   - Visit `http://localhost:3000`
   - Click "Create Goal"
   - Fill in details and submit

3. **Submit proof:**
   - Upload an image
   - Wait for AI verification (~2-5 seconds)
   - See verdict and blockchain transaction

4. **Check dashboard:**
   - View your stats
   - See success rate and streak

## 📖 API Documentation

### Core Endpoints

#### Create Goal
```http
POST /api/goals
Content-Type: application/json

{
  "goal_id": "goal_123",
  "user_id": "user_456",
  "description": "Go to gym 4 times per week",
  "stake_amount": 50,
  "duration_days": 30
}
```

**Response:**
```json
{
  "goal_id": "goal_123",
  "user_id": "user_456",
  "message": "Goal created successfully",
  "stake_locked": 50
}
```

#### Submit Proof
```http
POST /api/proof/submit
Content-Type: multipart/form-data

goal_id: goal_123
user_id: user_456
image_file: [binary]
```

**Response:**
```json
{
  "verdict": "approved",
  "confidence": 0.94,
  "message": "Verified. Confidence: 94%. You showed up.",
  "fraud_signals": [],
  "reasoning": "Clear gym equipment visible with proper timestamp",
  "processing_time_ms": 1247,
  "blockchain_tx": "0xabc123..."
}
```

#### Get User Stats
```http
GET /api/user/{user_id}/stats
```

**Response:**
```json
{
  "user_id": "user_456",
  "total_goals": 5,
  "approved_count": 18,
  "rejected_count": 2,
  "approval_rate": 0.9,
  "total_stake_locked": 250,
  "current_streak": 7,
  "personality_mode": "encouraging"
}
```

#### Get Platform Metrics
```http
GET /api/metrics/dashboard
```

## 🔍 How Fraud Detection Works

The agent employs multiple layers of fraud detection:

### 1. File Hash Analysis
- **Exact duplicate detection** - MD5/SHA256 hashing
- **Perceptual hashing** - Catches slightly modified images
- Prevents resubmission of same proof

### 2. Metadata Forensics
- **EXIF data analysis** - Timestamps, GPS, device info
- **Temporal patterns** - Submission timing anomalies
- **Device fingerprinting** - Detects suspicious patterns

### 3. Vision AI Analysis
- **GPT-4o Vision** - Understands image content
- **Context matching** - Compares to goal description
- **Confidence scoring** - 0-100% certainty

### 4. Behavioral Learning
- **Pattern database** - Learns from past fraud attempts
- **User profiling** - Tracks individual behavior
- **Adaptive thresholds** - Adjusts based on history

### 5. Decision Synthesis
```python
if fraud_score > 0.7:
    verdict = "FRAUD_DETECTED"
elif vision_confidence > 0.85 and fraud_score < 0.3:
    verdict = "APPROVED"
elif vision_verdict == "reject":
    verdict = "REJECTED"
else:
    verdict = "UNCLEAR"
```

Every fraud attempt is logged and strengthens the model.

## 📊 Opik Integration

Full observability with Opik AI monitoring:

### What Gets Logged

**Every verification includes:**
- **Input:** Goal context, proof type, metadata
- **Output:** Verdict, confidence, reasoning
- **Metrics:** Fraud score, processing time, signals detected
- **Tags:** Verdict type, confidence tier, personality used

### Access Metrics

```bash
# Via API
GET /api/metrics/dashboard

# Via Opik Dashboard
https://app.opik.ai/your-workspace
```

### Example Trace

```json
{
  "trace_id": "trace_abc123",
  "user_id": "user_456",
  "goal_id": "goal_123",
  "input": {
    "goal": "Go to gym 4 times per week",
    "proof_type": "photo"
  },
  "output": {
    "verdict": "approved",
    "confidence": 0.94,
    "reasoning": "Clear gym equipment visible"
  },
  "metrics": {
    "fraud_score": 0.12,
    "processing_time_ms": 1247,
    "fraud_signals_detected": 0
  },
  "tags": ["verdict:approved", "confidence:high", "personality:encouraging"]
}
```

## 🔗 Smart Contract

### PledgeEscrow Contract

Deployed on **Base L2** for low gas costs.

**Key Functions:**

```solidity
// User creates goal and locks stake
function lockStake(
    uint256 duration,
    address penaltyRecipient,
    uint256 requiredSubmissions,
    string calldata goalDescription,
    string calldata proofType
) external payable returns (uint256 goalId)

// Agent records verification result
function recordVerification(
    uint256 goalId,
    bool approved
) external onlyAgentBackend

// Release stake after deadline
function releaseStake(uint256 goalId) external

// Emergency withdrawal (7 days after deadline)
function emergencyWithdraw(uint256 goalId) external
```

**Features:**
- ✅ Minimum stake: 0.01 ETH
- ✅ Duration: 7-365 days
- ✅ Platform fee: 2% (capped at 5%)
- ✅ Emergency withdrawal after grace period
- ✅ Full event logging

**Gas Costs (Base L2):**
- Deploy contract: ~$0.50
- Record verification: ~$0.01
- Release stake: ~$0.02

### Deployment

See [contracts/DEPLOYMENT.md](contracts/DEPLOYMENT.md) for complete guide.

**Quick deploy to testnet:**
```bash
cd contracts
npm install
npm run deploy:base-sepolia
```

## 🗂️ Project Structure

```
pledgeagent/
├── backend/                      # Python FastAPI backend
│   ├── agent/
│   │   ├── brain.py              # Main orchestration engine
│   │   ├── verification.py       # GPT-4o Vision integration
│   │   ├── fraud_detector.py     # Pattern matching & learning
│   │   └── stake_adjuster.py     # Behavioral adaptation
│   ├── api/
│   │   └── main.py               # FastAPI server & routes
│   ├── blockchain/
│   │   └── contract_interface.py # Web3 integration
│   ├── observability/
│   │   └── opik_logger.py        # Opik logging
│   ├── tests/
│   │   └── test_verification.py  # Test suite
│   └── requirements.txt          # Python dependencies
│
├── contracts/                    # Smart contracts
│   ├── contracts/
│   │   └── PledgeEscrow.sol      # Main escrow contract
│   ├── scripts/
│   │   └── deploy.js             # Deployment script
│   ├── test/
│   │   └── PledgeEscrow.test.js  # Contract tests
│   ├── hardhat.config.js         # Hardhat configuration
│   ├── package.json              # Node dependencies
│   └── DEPLOYMENT.md             # Deployment guide
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── CreateGoalPage.tsx
│   │   │   ├── SubmitProofPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── components/           # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── utils/
│   │   │   └── api.ts            # API client
│   │   └── App.tsx               # Main app
│   ├── package.json
│   └── README.md                 # Frontend docs
│
├── docs/                         # Documentation
│   ├── FRONTEND_COMPLETE.md      # Frontend overview
│   ├── RUN_EVERYTHING.md         # E2E setup guide
│   └── SMART_CONTRACT_INTEGRATION.md
│
├── README.md                     # This file
├── PROJECT_OVERVIEW.md           # Architecture details
└── GETTING_STARTED.md            # Quick start guide
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest

# Test specific modules
python -m tests.test_verification
python -m tests.test_fraud_detector
```

### Contract Tests

```bash
cd contracts
npx hardhat test
```

**Test Coverage:**
- ✅ Goal creation with validation
- ✅ Proof verification recording
- ✅ Stake release (success/failure)
- ✅ Emergency withdrawal
- ✅ Access control
- ✅ Fee calculation

### Frontend Tests

```bash
cd frontend
npm test
```

## 🎯 Roadmap

### ✅ Phase 1 - Core System (Complete)
- [x] Agent brain with decision-making
- [x] GPT-4o Vision verification
- [x] Fraud detection system
- [x] Smart contract on Base
- [x] Frontend UI (4 pages, 8 components)
- [x] Backend API (4 endpoints)
- [x] Opik integration
- [x] Web3 integration

### 🚧 Phase 2 - Enhancement (In Progress)
- [ ] Database persistence (PostgreSQL)
- [ ] Additional proof types (Strava, GitHub, Calendar)
- [ ] Real-time WebSocket notifications
- [ ] Advanced fraud detection (ML models)
- [ ] Mobile-responsive improvements

### 📋 Phase 3 - Scale (Planned)
- [ ] Multi-user accountability pods
- [ ] Social features (leaderboards, sharing)
- [ ] Mobile app (React Native)
- [ ] Production deployment
- [ ] Security audit
- [ ] Mainnet launch

## 💰 Cost Breakdown

### Development Costs
- OpenAI API (GPT-4o Vision): ~$2-3 per 1000 verifications
- Opik logging: Free tier (up to 10k traces/month)
- Base L2 gas: ~$10 per 1000 verifications
- **Total: ~$12-13 per 1000 verifications**

### Infrastructure (Production)
- Backend hosting (Railway/Render): ~$20/month
- Database (PostgreSQL): ~$10/month
- Frontend hosting (Vercel): Free
- **Total: ~$30/month**

### User Costs
- Create goal: ~$0.02 (gas)
- Submit proof: Free (backend pays gas)
- Claim stake: ~$0.02 (gas)

## 🔐 Security

### Smart Contract Security
- ✅ Minimum stake requirements
- ✅ Time-locked withdrawals
- ✅ Agent authorization
- ✅ Emergency withdrawal mechanism
- ✅ Platform fee cap (5% max)
- ⚠️ **Audit recommended before mainnet**

### Backend Security
- ✅ API key management via environment variables
- ✅ Input validation on all endpoints
- ✅ File upload size limits
- ✅ Rate limiting (production)
- ✅ CORS configuration

### Best Practices
- Never commit `.env` files
- Use hardware wallet for mainnet deployment
- Monitor agent wallet balance
- Set up alerts for suspicious activity
- Regular security updates

## 📚 Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Quick start guide
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Architecture deep dive
- **[contracts/DEPLOYMENT.md](contracts/DEPLOYMENT.md)** - Contract deployment
- **[frontend/README.md](frontend/README.md)** - Frontend documentation
- **[RUN_EVERYTHING.md](RUN_EVERYTHING.md)** - E2E setup guide

## 🤝 Contributing

Contributions welcome! This project is open source.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow existing code style
- Update documentation
- Add comments for complex logic

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏆 Built For

**Opik AI Agents Hackathon** - January 2026

Demonstrating:
- ✅ Autonomous agent decision-making
- ✅ Learning from adversarial interactions
- ✅ Full observability with Opik
- ✅ Real financial stakes via smart contracts
- ✅ Production-ready architecture

## 📧 Contact & Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/yourusername/pledgeagent/issues)
- **Twitter:** [@pledgeagent](https://twitter.com/pledgeagent)
- **Email:** team@pledgeagent.xyz
- **Discord:** [Join our community](https://discord.gg/pledgeagent)

## 🙏 Acknowledgments

- **OpenAI** - GPT-4o Vision API
- **Opik** - AI observability platform
- **Base** - L2 blockchain infrastructure
- **Hardhat** - Smart contract development
- **FastAPI** - Python web framework
- **React** - Frontend framework

---

## 💡 Philosophy

**The agent doesn't ask if you went to the gym. It verifies you went. And if you didn't? It takes your money.**

That's accountability.

---

**Ready to enforce your resolutions? Deploy PledgeAgent today.** 🚀

```bash
# Quick start
git clone https://github.com/yourusername/pledgeagent.git
cd pledgeagent
./setup.sh  # Automated setup script
```
