
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQ: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white text-center">
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-blue-400 transition-colors">
                What is a faucet?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                A faucet is a service that provides free testnet cryptocurrency for developers and users to test applications. 
                Testnet tokens have no real-world value and are used exclusively for development, testing, and educational purposes. 
                Our Sepolia faucet provides free Sepolia ETH to help you test smart contracts and dApps on the Ethereum Sepolia testnet.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-blue-400 transition-colors">
                How does the faucet work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <div className="space-y-2">
                  <p>Our faucet operates through a simple process:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Enter your Ethereum wallet address or ENS name</li>
                    <li>Complete any required verification (if applicable)</li>
                    <li>Submit your request</li>
                    <li>Our system validates your address and checks rate limits</li>
                    <li>0.05 Sepolia ETH is automatically sent to your wallet</li>
                    <li>You'll receive a transaction hash to track the transfer</li>
                  </ol>
                  <p className="mt-2">
                    The entire process is automated and typically takes 1-2 minutes depending on network congestion.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-blue-400 transition-colors">
                How many requests can I make?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <div className="space-y-2">
                  <p>To ensure fair distribution and prevent abuse, we have the following limits:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Per Address:</strong> Maximum 0.05 ETH per wallet address every 24 hours</li>
                    <li><strong>Per IP:</strong> One request per IP address per day</li>
                    <li><strong>Amount:</strong> Each successful request provides exactly 0.05 Sepolia ETH</li>
                  </ul>
                  <p className="mt-2">
                    These limits reset every 24 hours from your last successful request. If you need more testnet ETH for extensive testing, 
                    consider using multiple wallet addresses or alternative Sepolia faucets.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-blue-400 transition-colors">
                What should I do if I don't receive funds?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <div className="space-y-2">
                  <p>If you don't receive your Sepolia ETH, please check the following:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Ensure you're connected to the Sepolia testnet in your wallet</li>
                    <li>Verify that you entered the correct wallet address</li>
                    <li>Check if you've exceeded the daily rate limit</li>
                    <li>Look for the transaction hash and verify it on Etherscan</li>
                    <li>Wait a few minutes as network congestion can delay transactions</li>
                  </ul>
                  <p className="mt-2">
                    If the transaction shows as successful on Etherscan but you don't see the funds, 
                    make sure your wallet is configured to display Sepolia testnet tokens.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
