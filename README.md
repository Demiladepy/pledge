# PledgeAgent

**An adversarial AI agent that enforces New Year's resolutions through financial stakes and multimodal proof verification.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with OpenAI](https://img.shields.io/badge/Built%20with-OpenAI-412991.svg)](https://openai.com)
[![Deployed on Base](https://img.shields.io/badge/Deployed%20on-Base-0052FF.svg)](https://base.org)

---

##  What Is This?

92% of New Year's resolutions fail by February. **PledgeAgent** changes that with AI-enforced accountability:

1. **Lock money** in a smart contract
2. **Submit proof** of your progress
3. **AI verifies** using GPT-4o Vision + fraud detection
4. **Succeed or lose** - Get your money back, or it goes to charity

##  Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/pledgeagent.git
cd pledgeagent/pledgeagent

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
python api/main.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Smart Contract (new terminal)
cd contracts
npm install
npm run deploy:base-sepolia
```

** See [pledgeagent/README.md](pledgeagent/README.md) for complete documentation.**

##  Project Structure

```
pledgeagent/
├── pledgeagent/              # Main application
│   ├── backend/              # Python FastAPI backend
│   │   ├── agent/            # AI agent logic
│   │   ├── api/              # REST API
│   │   ├── blockchain/       # Web3 integration
│   │   └── observability/    # Opik logging
│   ├── contracts/            # Smart contracts (Solidity)
│   │   ├── contracts/        # Contract source
│   │   ├── scripts/          # Deployment scripts
│   │   └── test/             # Contract tests
│   ├── frontend/             # React frontend
│   │   ├── src/              # Source code
│   │   │   ├── pages/        # Page components
│   │   │   └── components/   # Reusable components
│   │   └── dist/             # Production build
│   └── docs/                 # Documentation
│
├── FRONTEND_COMPLETE.md      # Frontend overview
├── RUN_EVERYTHING.md         # E2E setup guide
└── README.md                 # This file
```

##  Architecture

```
Frontend (React) → Backend (FastAPI) → Agent Brain
                                        ├─ GPT-4o Vision
                                        ├─ Fraud Detector
                                        ├─ Stake Adjuster
                                        └─ Opik Logger
                   → Smart Contract (Base L2)
```

##  Features

### Backend
-  **Agent Brain** - Autonomous decision-making
-  **GPT-4o Vision** - Multimodal proof verification
-  **Fraud Detection** - Learning-based pattern matching
-  **Behavioral Adaptation** - Adjusts stakes based on patterns
-  **Opik Integration** - Full observability
-  **Web3 Integration** - On-chain verification recording

### Frontend
-  **4 Complete Pages** - Home, Create Goal, Submit Proof, Dashboard
-  **8 Reusable Components** - Button, Card, Input, etc.
-  **TypeScript** - 100% type coverage
-  **Tailwind CSS** - Responsive design
-  **GSAP Animations** - Smooth transitions
-  **Production Build** - Optimized to 116 KB gzipped

### Smart Contract
-  **PledgeEscrow** - Secure stake locking
-  **Base L2 Deployment** - Low gas costs (~$0.01/tx)
-  **Agent Authorization** - Backend can record verifications
-  **Emergency Withdrawal** - User protection
-  **Platform Fee** - 2% (capped at 5%)
-  **Full Test Suite** - 9 comprehensive tests

##  Documentation

| Document | Description |
|----------|-------------|
| [pledgeagent/README.md](pledgeagent/README.md) | Complete documentation |
| [FRONTEND_COMPLETE.md](FRONTEND_COMPLETE.md) | Frontend overview |
| [RUN_EVERYTHING.md](RUN_EVERYTHING.md) | E2E setup guide |
| [pledgeagent/PROJECT_OVERVIEW.md](pledgeagent/PROJECT_OVERVIEW.md) | Architecture details |
| [pledgeagent/contracts/DEPLOYMENT.md](pledgeagent/contracts/DEPLOYMENT.md) | Contract deployment |
| [pledgeagent/SMART_CONTRACT_INTEGRATION.md](pledgeagent/SMART_CONTRACT_INTEGRATION.md) | Blockchain integration |

##  Testing

```bash
# Backend tests
cd pledgeagent/backend
pytest

# Contract tests
cd pledgeagent/contracts
npx hardhat test

# Frontend tests
cd pledgeagent/frontend
npm test
```

##  Cost Estimates

**Per 1000 Verifications:**
- OpenAI API: ~$2-3
- Base L2 gas: ~$10
- Opik logging: Free
- **Total: ~$12-13**

**Infrastructure (Monthly):**
- Backend hosting: ~$20
- Database: ~$10
- Frontend: Free (Vercel)
- **Total: ~$30/month**

##  Current Status

###  Complete
- Core agent brain with decision-making
- GPT-4o Vision verification
- Fraud detection system
- Smart contract on Base
- Frontend UI (4 pages, 8 components)
- Backend API (4 endpoints)
- Opik integration
- Web3 integration
- Comprehensive documentation

###  In Progress
- Database persistence
- Additional proof types
- Real-time notifications

###  Planned
- Multi-user accountability pods
- Social features
- Mobile app
- Production deployment


Demonstrating:
- Autonomous agent decision-making
- Learning from adversarial interactions
- Full observability with Opik
- Real financial stakes via smart contracts


**The agent doesn't ask if you went to the gym. It verifies you went. And if you didn't? It takes your money.**

That's accountability. 🚀
