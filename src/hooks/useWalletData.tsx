import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsDemoMode } from './useIsDemoMode';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'reward' | 'purchase' | 'withdrawal';
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
  const { isDemoMode, getDemoUserId } = useIsDemoMode();
  const [walletData, setWalletData] = useState<WalletData>({
    zoozBalance: 0,
    usdValue: 0,
    percentageChange: 0,
    transactions: []
  });

  useEffect(() => {
    const fetchWalletData = async () => {
      if (isDemoMode) {
        // Fetch demo wallet data
        const demoUserId = getDemoUserId();
        if (!demoUserId) return;

        // Get balance
        const { data: balanceData } = await supabase
          .from('user_balances')
          .select('*')
          .eq('user_id', demoUserId)
          .maybeSingle();

        // Get transactions - cast to any to handle dynamic table
        const { data: transactionsData } = await supabase
          .from('demo_zooz_transactions' as any)
          .select('*')
          .or(`from_user_id.eq.${demoUserId},to_user_id.eq.${demoUserId}`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (balanceData) {
          setWalletData({
            zoozBalance: balanceData.zooz_balance || 0,
            usdValue: balanceData.usd_value || 0,
            percentageChange: balanceData.percentage_change || 0,
            transactions: (transactionsData || []).map((tx: any) => ({
              id: tx.id,
              type: tx.transaction_type as 'send' | 'receive' | 'reward' | 'purchase' | 'withdrawal',
              amount: tx.amount,
              description: tx.description || '',
              timestamp: new Date(tx.created_at),
              fromTo: tx.note || undefined
            }))
          });
        }
      } else {
        // Use mock data for non-demo mode (until real auth is implemented)
        setWalletData({
          zoozBalance: 9957,
          usdValue: 127.43,
          percentageChange: 2.3,
          transactions: mockTransactions
        });
      }
    };

    fetchWalletData();
  }, [isDemoMode, getDemoUserId]);

  // Simulate real-time USD conversion updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWalletData(prev => ({
        ...prev,
        usdValue: prev.usdValue + (Math.random() - 0.5) * 0.5,
        percentageChange: prev.percentageChange + (Math.random() - 0.5) * 0.2
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return walletData;
};