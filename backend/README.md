
# Sepolia Faucet Backend

A secure and efficient backend API for distributing Sepolia testnet ETH to developers and testers.

## Features

- 🚰 Automated Sepolia ETH distribution (0.05 ETH per request)
- 🛡️ IP-based rate limiting (24-hour cooldown)
- 🔍 Address validation (supports both addresses and ENS names)
- 📊 Real-time balance monitoring
- 🚀 Fast transaction processing with EIP-1559
- 🔒 Secure private key handling
- 📈 Health checks and status endpoints

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Infura or Alchemy account (for Sepolia RPC)
- Sepolia testnet ETH for funding the faucet wallet

## Installation

1. **Clone and navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.template .env
```

4. **Edit `.env` file with your configuration:**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
RATE_LIMIT_WINDOW=86400000
```

## Configuration Guide

### 1. Get Sepolia RPC URL

**Option A: Infura (Recommended)**
1. Go to [infura.io](https://infura.io/)
2. Create a free account
3. Create a new project
4. Copy the Sepolia endpoint URL
5. Replace `YOUR_INFURA_PROJECT_ID` in the `.env` file

**Option B: Alchemy**
1. Go to [alchemy.com](https://alchemy.com/)
2. Create a free account
3. Create a new app (select Sepolia network)
4. Copy the HTTPS URL
5. Update `SEPOLIA_RPC` in the `.env` file

### 2. Set Up Faucet Wallet

1. **Create a new wallet** (recommended for security):
```bash
# You can use any Ethereum wallet or generate one programmatically
# For testing, you can use MetaMask and export the private key
```

2. **Fund your wallet with Sepolia ETH:**
   - Visit [sepoliafaucet.com](https://sepoliafaucet.com/)
   - Or [sepolia-faucet.pk910.de](https://sepolia-faucet.pk910.de/)
   - Request at least 1 ETH to operate the faucet

3. **Add private key to .env:**
```env
PRIVATE_KEY=0x1234567890abcdef...
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### POST /api/drip
Send 0.05 Sepolia ETH to an address.

**Request:**
```json
{
  "address": "0x742d35cc6634c0532925a3b8d16d78f701bdc" 
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully sent 0.05 Sepolia ETH to 0x742d35cc...",
  "txHash": "0xabc123...",
  "amount": "0.05",
  "network": "Sepolia",
  "processingTime": "2341ms"
}
```

**Response (Rate Limited):**
```json
{
  "error": "Rate limit exceeded",
  "message": "You can only request funds once every 24 hours. Please try again in 23 hour(s).",
  "retryAfter": 82800,
  "resetTime": "2024-07-08T10:30:00.000Z"
}
```

### GET /api/status
Get faucet status and statistics.

**Response:**
```json
{
  "isOnline": true,
  "network": {
    "name": "sepolia",
    "chainId": "11155111"
  },
  "faucetAddress": "0x...",
  "balance": "2.45",
  "currentBlock": 4850234,
  "amount": "0.05",
  "timestamp": "2024-07-07T10:30:00.000Z"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-07-07T10:30:00.000Z",
  "service": "sepolia-faucet-backend"
}
```

## Rate Limiting

- **Per IP:** 1 request per 24 hours
- **Amount:** 0.05 ETH per successful request
- **Window:** Rolling 24-hour window from first request
- **Storage:** In-memory (resets on server restart)

## Security Features

- 🔒 Private key validation on startup
- 🛡️ Helmet.js security headers
- 🚫 CORS protection
- 📝 Request logging with Morgan
- ⚡ Input validation and sanitization
- 🔍 Address checksum validation

## Error Handling

The API provides detailed error messages for common scenarios:

- Invalid Ethereum addresses
- Insufficient faucet funds
- Network connectivity issues
- Rate limit violations
- Gas estimation failures

## Monitoring

The backend includes comprehensive logging:

```bash
🚀 Sepolia Faucet Backend running on port 5000
🔗 Connected to Sepolia network
💰 Faucet wallet address: 0x742d35cc...
💰 Current faucet balance: 2.45 ETH
💧 Drip request from ::1 for address: 0x123...
✅ Successfully sent funds to 0x123... in 2341ms
```

## Deployment

### Vercel (Serverless)
```bash
npm install -g vercel
vercel
```

### Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Render
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy with auto-deploy on push

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `SEPOLIA_RPC` | Sepolia RPC endpoint | `https://sepolia.infura.io/v3/...` |
| `PRIVATE_KEY` | Faucet wallet private key | `0x1234...` |
| `RATE_LIMIT_WINDOW` | Rate limit window in ms | `86400000` (24 hours) |

## Troubleshooting

### Common Issues

1. **"PRIVATE_KEY not set"**
   - Make sure you've copied `.env.template` to `.env`
   - Verify your private key starts with `0x`

2. **"Unable to connect to Sepolia network"**
   - Check your `SEPOLIA_RPC` URL
   - Verify your Infura/Alchemy project is active
   - Test the RPC URL in a browser

3. **"Insufficient funds"**
   - Fund your faucet wallet with Sepolia ETH
   - Check balance with the `/api/status` endpoint

4. **"Gas estimation failed"**
   - Network congestion or RPC issues
   - Usually resolves by retrying

### Development Tips

- Use `npm run dev` for auto-reload during development
- Check logs for detailed transaction information
- Monitor wallet balance regularly
- Test with small amounts first

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs for detailed error messages
3. Ensure your environment variables are correctly set
4. Verify your wallet has sufficient Sepolia ETH
