import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'reward' | 'purchase';
  amount: number;
  description: string;
  timestamp: Date;
  fromTo?: string;
}

interface WalletData {
  zoozBalance: number;
  usdValue: number;
  percentageChange: number;
  transactions: Transaction[];
}

// Mock data for development
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'reward',
    amount: 10,
    description: 'תגובה על חדשות',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    type: 'receive',
    amount: 5,
    description: 'חבר חדש הצטרף',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    fromTo: 'דוד כהן'
  },
  {
    id: '3',
    type: 'send',
    amount: 25,
    description: 'העברה',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    fromTo: 'שרה לוי'
  },
  {
    id: '4',
    type: 'purchase',
    amount: 100,
    description: 'רכישת ZOOZ',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: '5',
    type: 'reward',
    amount: 1,
    description: 'השתתפות בסקר',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  }
];

export const useWalletData = (): WalletData => {
  const [walletData, setWalletData] = useState<WalletData>({
    zoozBalance: 9957,
    usdValue: 127.43,
    percentageChange: 2.3,
    transactions: mockTransactions
  });

  // Simulate real-time USD conversion updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWalletData(prev => ({
        ...prev,
        usdValue: prev.usdValue + (Math.random() - 0.5) * 0.5,
        percentageChange: prev.percentageChange + (Math.random() - 0.5) * 0.2
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return walletData;
};