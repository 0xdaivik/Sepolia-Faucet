
import React, { useState } from 'react';
import { ChevronDown, Droplets, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FaucetResponse {
  success: boolean;
  message: string;
  txHash?: string;
}

const FaucetForm: React.FC = () => {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('sepolia');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<FaucetResponse | null>(null);

  const validateAddress = (addr: string): boolean => {
    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    const ensRegex = /^[a-z0-9-]+\.eth$/;
    return ethAddressRegex.test(addr) || ensRegex.test(addr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setResponse({
        success: false,
        message: 'Please enter a valid wallet address or ENS name'
      });
      return;
    }

    if (!validateAddress(address)) {
      setResponse({
        success: false,
        message: 'Please enter a valid Ethereum address (0x...) or ENS name (.eth)'
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001';
      const apiResponse = await fetch(`${backendUrl}/api/drip/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await apiResponse.json();
      
      if (apiResponse.ok) {
        setResponse({
          success: true,
          message: data.message || 'Successfully sent 0.05 Sepolia ETH!',
          txHash: data.txHash
        });
        setAddress(''); // Clear form on success
      } else {
        setResponse({
          success: false,
          message: data.error || 'Failed to send funds. Please try again.'
        });
      }
    } catch (error) {
      console.error('Request failed:', error);
      setResponse({
        success: false,
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-600/20 rounded-full">
              <Droplets className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Sepolia ETH Faucet
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Get free Sepolia testnet ETH for development and testing
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Network
              </label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="sepolia" className="text-white hover:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Ethereum Sepolia</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Wallet Address or ENS Name
              </label>
              <Input
                type="text"
                placeholder="0x... or example.eth"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !address.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4" />
                  <span>Receive 0.05 Sepolia ETH</span>
                </div>
              )}
            </Button>
          </form>

          {/* Status Messages */}
          {response && (
            <Alert className={`${
              response.success 
                ? 'bg-green-900/20 border-green-800 text-green-400' 
                : 'bg-red-900/20 border-red-800 text-red-400'
            }`}>
              <div className="flex items-center space-x-2">
                {response.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription className="flex-1">
                  {response.message}
                </AlertDescription>
              </div>
              {response.txHash && (
                <div className="mt-2 pt-2 border-t border-green-800">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${response.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    <span>View on Etherscan</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </Alert>
          )}

          {/* Rate Limit Info */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Rate Limits</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Maximum 0.05 ETH per address per 24 hours</li>
              <li>• One request per IP address per day</li>
              <li>• Funds are sent from our secure faucet wallet</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaucetForm;
