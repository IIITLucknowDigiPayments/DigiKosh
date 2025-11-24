# How to Run the Digital Payment Project

## Prerequisites
- ✅ Node.js v20.11.0 (installed)
- ✅ npm 9.8.1 (installed)
- ✅ MongoDB Atlas connection (configured in `.env`)
- ✅ Environment variables configured

## Project Structure
- **Backend**: Express.js API server (Port 3001)
- **Frontend**: Next.js application (Port 3000)
- **Contracts**: Hardhat smart contracts

---

## Step-by-Step Instructions

### 1. Start the Backend Server

Open a **new terminal window** and run:

```bash
cd backend
npm run dev
```

**Expected Output:**
- ✅ Connected to MongoDB
- ✅ Event indexer started
- 🚀 Server running on port 3001
- 📡 API available at http://localhost:3001/api/v1

**Keep this terminal open!**

---

### 2. Start the Frontend Server

Open **another new terminal window** and run:

```bash
cd frontend
npm run dev
```

**Expected Output:**
- Ready on http://localhost:3000
- Compiled successfully

**Keep this terminal open!**

---

### 3. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Backend Health Check**: http://localhost:3001/health

---

## Available Scripts

### Backend (`backend/`)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

### Frontend (`frontend/`)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

### Contracts (`contracts/`)
- `npm run compile` - Compile smart contracts
- `npm test` - Run tests
- `npm run deploy:ethereum` - Deploy to Ethereum Mainnet
- `npm run deploy:gnosis` - Deploy to Gnosis Chain
- `npm run deploy:base-sepolia` - Deploy to Base Sepolia

---

## Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Check your `MONGODB_URI` in `backend/.env`
- **Port Already in Use**: Change `PORT` in `backend/.env` or kill the process using port 3001
- **RPC Connection Error**: Verify `RPC_URL` in `backend/.env` is correct

### Frontend Issues
- **API Connection Error**: Ensure backend is running on port 3001
- **Port Already in Use**: Change Next.js port: `npm run dev -- -p 3001` (if backend uses different port)
- **Build Errors**: Clear `.next` folder: `rm -rf .next` (or `Remove-Item -Recurse -Force .next` on Windows)

### General Issues
- **Module Not Found**: Run `npm install` in the respective directory
- **TypeScript Errors**: Run `npm run type-check` in backend or check tsconfig.json

---

## Environment Variables

### Backend (`.env` in `backend/`)
- `MONGODB_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 3001)
- `RPC_URL` - Blockchain RPC endpoint
- Contract addresses (CONTRIBUTOR_REGISTRY, QUADRATIC_VOTING, etc.)

### Contracts (`.env` in `contracts/`)
- Network configurations
- RPC URLs and private keys
- Contract addresses

---

## Quick Start (All at Once)

If you want to run everything quickly, use separate terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

Then open http://localhost:3000 in your browser!

---

## Notes
- Backend must be running before frontend can make API calls
- MongoDB connection is required for backend to start
- Frontend connects to backend at `http://localhost:3001/api/v1` by default
- Contracts are already deployed on Gnosis Chiado (addresses in `.env`)

