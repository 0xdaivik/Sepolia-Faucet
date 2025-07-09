
# Sepolia ETH Faucet

A modern, full-stack Ethereum Sepolia testnet faucet with a beautiful dark UI inspired by Google Cloud Faucet. Built with React, Node.js, and Ethers.js.

## ✨ Features

### Frontend
- 🎨 **Beautiful Dark UI** - Minimalist design inspired by Google Cloud Faucet
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Feedback** - Instant status updates and transaction tracking
- 🔍 **ENS Support** - Accepts both Ethereum addresses and ENS names
- 📊 **Rate Limit Display** - Clear information about usage limits
- 🔗 **Etherscan Integration** - Direct links to transaction details

### Backend
- 🚰 **Automated Distribution** - Sends 0.05 Sepolia ETH per request
- 🛡️ **Rate Limiting** - IP-based cooldown (24 hours)
- 🔒 **Secure Wallet Management** - Private key handling with best practices
- 📈 **Real-time Monitoring** - Balance checks and transaction logging
- 🌐 **ENS Resolution** - Automatic ENS name resolution
- 🔍 **Address Validation** - Comprehensive input validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- Infura or Alchemy account for Sepolia RPC
- Sepolia testnet ETH for funding the faucet wallet

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sepolia-faucet
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.template .env
```

Edit `.env` with your configuration:
```env
PORT=5000
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=0xYOUR_FUNDED_WALLET_PRIVATE_KEY
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
# In a new terminal
cd frontend  # Navigate to the root directory (the current project)
npm run dev
```

### 4. Fund Your Faucet Wallet
Visit [sepoliafaucet.com](https://sepoliafaucet.com/) to get Sepolia ETH for your faucet wallet.

## 📁 Project Structure

```
sepolia-faucet/
├── src/                          # Frontend (React + Vite)
│   ├── components/
│   │   ├── FaucetForm.tsx       # Main faucet interface
│   │   └── FAQ.tsx              # Frequently asked questions
│   ├── pages/
│   │   └── Index.tsx            # Main page layout
│   └── ...
├── backend/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/drip.js       # API endpoints
│   │   ├── services/faucetService.js  # Ethereum transactions
│   │   ├── middlewares/rateLimiter.js # Rate limiting
│   │   └── utils/validateAddress.js   # Address validation
│   └── ...
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
RATE_LIMIT_WINDOW=86400000
```

**Frontend (.env)**
```env
VITE_BACKEND_API_URL=http://localhost:5000
```

### Getting RPC Access

**Infura (Recommended):**
1. Go to [infura.io](https://infura.io/)
2. Create a free account and new project
3. Copy the Sepolia endpoint URL

**Alchemy:**
1. Go to [alchemy.com](https://alchemy.com/)
2. Create a free account and new app
3. Select Sepolia network and copy HTTPS URL

## 🌐 API Reference

### POST /api/drip
Send 0.05 Sepolia ETH to an address.

```bash
curl -X POST http://localhost:5000/api/drip \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35cc6634c0532925a3b8d16d78f701bdc"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully sent 0.05 Sepolia ETH to 0x742d35cc...",
  "txHash": "0xabc123...",
  "amount": "0.05",
  "network": "Sepolia"
}
```

### GET /api/status
Get faucet status and balance information.

```bash
curl http://localhost:5000/api/status
```

### GET /health
Health check endpoint.

```bash
curl http://localhost:5000/health
```

## 🛡️ Security Features

- **Private Key Security**: Environment variable storage, never exposed to frontend
- **Rate Limiting**: IP-based restrictions to prevent abuse
- **Input Validation**: Comprehensive address and ENS validation
- **CORS Protection**: Configured for specific frontend origins
- **Security Headers**: Helmet.js for additional security
- **Error Handling**: Secure error responses without sensitive information

## 📊 Rate Limits

- **Per IP Address**: 1 request every 24 hours
- **Per Wallet**: 0.05 ETH maximum per request
- **Cooldown Period**: Rolling 24-hour window

## 🎨 UI Features

### Dark Theme Design
- Modern gradient backgrounds
- Subtle animations and transitions
- Responsive card-based layout
- Professional typography
- Status indicators with icons

### Interactive Elements
- Real-time form validation
- Loading states with spinners
- Success/error message displays
- Transaction hash links to Etherscan
- Collapsible FAQ section

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables in the platform dashboard
3. Deploy with auto-deploy on push

### Environment Variables for Production
Make sure to set all required environment variables in your hosting platform:
- `SEPOLIA_RPC`
- `PRIVATE_KEY`
- `FRONTEND_URL` (your deployed frontend URL)

## 🧪 Testing

### Test the Faucet
1. Start both frontend and backend servers
2. Open `http://localhost:5173` in your browser
3. Enter a Sepolia wallet address
4. Request funds and verify the transaction

### Test with Your Own Wallet
1. Add Sepolia network to MetaMask:
   - Network Name: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   - Chain ID: 11155111
   - Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

## 📋 Troubleshooting

### Common Issues

**"PRIVATE_KEY not set"**
- Ensure you've copied `.env.template` to `.env`
- Verify your private key starts with `0x`

**"Unable to connect to Sepolia network"**
- Check your `SEPOLIA_RPC` URL
- Verify your Infura/Alchemy project is active

**"Insufficient funds"**
- Fund your faucet wallet at [sepoliafaucet.com](https://sepoliafaucet.com/)
- Check balance with `/api/status` endpoint

**"CORS errors"**
- Ensure `FRONTEND_URL` matches your frontend's actual URL
- Check that both servers are running

### Development Tips
- Use browser developer tools to monitor network requests
- Check backend logs for detailed transaction information
- Monitor faucet wallet balance regularly
- Test with small amounts first

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the backend logs for detailed error messages
3. Ensure your environment variables are correctly set
4. Verify your faucet wallet has sufficient Sepolia ETH

## 🔗 Useful Links

- [Sepolia Faucet (sepoliafaucet.com)](https://sepoliafaucet.com/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Ethereum Sepolia Documentation](https://ethereum.org/en/developers/docs/networks/#sepolia)
- [Infura Documentation](https://docs.infura.io/)
- [Ethers.js Documentation](https://docs.ethers.org/)
