
import React from 'react';
import FaucetForm from '@/components/FaucetForm';
import FAQ from '@/components/FAQ';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Sepolia Faucet
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get free Sepolia testnet ETH instantly. Perfect for developers testing smart contracts and dApps.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <FaucetForm />
            <FAQ />
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-700">
            <div className="text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Sepolia Explorer
                </a>
                <a
                  href="https://sepoliafaucet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Alternative Faucet
                </a>
                <a
                  href="https://ethereum.org/en/developers/docs/networks/#sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  About Sepolia
                </a>
              </div>
              <p className="text-sm text-gray-500">
                Built for the Ethereum development community. This faucet provides testnet ETH only.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
