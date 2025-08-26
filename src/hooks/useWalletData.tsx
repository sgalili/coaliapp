import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData>({
    zoozBalance: 0,
    usdValue: 0,
    percentageChange: 0,
    transactions: []
  });

  // Fetch wallet data from database
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user balance
        const { data: balance } = await supabase
          .from('user_balances')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch transactions
        const { data: transactions } = await supabase
          .from('zooz_transactions')
          .select('*')
          .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(20);

        const formattedTransactions: Transaction[] = (transactions || []).map(tx => ({
          id: tx.id,
          type: tx.from_user_id === user.id ? 'send' : 
                tx.transaction_type === 'reward' ? 'reward' : 'receive',
          amount: tx.amount,
          description: tx.description || 'העברה',
          timestamp: new Date(tx.created_at),
          fromTo: tx.from_user_id === user.id ? 'העברה יוצאת' : 'העברה נכנסת'
        }));

        const zoozBalance = balance?.zooz_balance || 0;
        const usdValue = zoozBalance * 0.013; // Mock conversion rate
        
        setWalletData({
          zoozBalance,
          usdValue,
          percentageChange: balance?.percentage_change || 0,
          transactions: formattedTransactions.length > 0 ? formattedTransactions : mockTransactions
        });
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        // Fallback to mock data
        setWalletData({
          zoozBalance: 9957,
          usdValue: 127.43,
          percentageChange: 2.3,
          transactions: mockTransactions
        });
      }
    };

    fetchWalletData();
  }, [user?.id]);

  // Simulate real-time USD conversion updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWalletData(prev => ({
        ...prev,
        usdValue: prev.zoozBalance * (0.013 + (Math.random() - 0.5) * 0.001),
        percentageChange: prev.percentageChange + (Math.random() - 0.5) * 0.2
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return walletData;
};