# Quick Start Guide

Get PledgeAgent frontend running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Terminal/PowerShell open

## Step 1: Navigate to Frontend

```bash
cd pledgeagent/frontend
```

## Step 2: Install Dependencies

```bash
npm install
```

Wait for completion (~2-3 minutes)

## Step 3: Start Development Server

```bash
npm run dev
```

You'll see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 4: Open in Browser

Click the link or manually go to: **http://localhost:3000**

## ✅ You're Live!

The frontend is now running with:
- ✅ Hot reload (edit code, see changes instantly)
- ✅ All pages working
- ✅ Ready to connect to backend

## Testing (Optional)

To test the full system with backend:

**Terminal 2:**
```bash
cd pledgeagent/backend
python api/main.py
```

Then in browser:
1. Go to http://localhost:3000
2. Click "Create Goal"
3. Fill in details and submit
4. See goal created successfully
5. Click "Submit Proof"
6. Upload an image
7. See verification result

## Common Commands

```bash
npm run dev       # Development (hot reload)
npm run build     # Production build
npm run lint      # Check code quality
npm run format    # Auto-format code
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"npm not found"** | Install Node.js from nodejs.org |
| **Port 3000 in use** | Change port in vite.config.ts |
| **Build errors** | Delete node_modules & package-lock.json, run npm install |
| **API not working** | Start backend: `python api/main.py` |

## File Locations

- **Components**: `src/components/`
- **Pages**: `src/pages/`
- **API**: `src/utils/api.ts`
- **Styling**: `tailwind.config.js`
- **Config**: `vite.config.ts`

## What's Next?

1. Read [README.md](./README.md) for feature overview
2. Read [DEVELOPMENT.md](./DEVELOPMENT.md) for architecture
3. Explore `src/components/` to understand patterns
4. Make a change and see hot reload in action
5. Connect to backend and test end-to-end

## Documentation

- **README.md** - Feature overview
- **DEVELOPMENT.md** - Development guide
- **BUILD_SUMMARY.md** - Build details
- **FILE_STRUCTURE.md** - File organization

---

**That's it! Enjoy the frontend! 🚀**
