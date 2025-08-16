import { ArrowUpRight, ArrowDownLeft, Users, MessageCircle } from "lucide-react";
import { Card } from "./ui/card";

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'reward' | 'purchase';
  amount: number;
  description: string;
  timestamp: Date;
  fromTo?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'reward':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'purchase':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <ArrowDownLeft className="w-4 h-4" />;
    }
  };

  const getAmountDisplay = (transaction: Transaction) => {
    const sign = transaction.type === 'send' ? '-' : '+';
    const color = transaction.type === 'send' ? 'text-red-600' : 'text-green-600';
    
    return (
      <span className={`font-medium ${color}`}>
        {sign}{transaction.amount}Z
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-right">היסטוריית עסקאות</h3>
      
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              {getTransactionIcon(transaction.type)}
              <div className="text-right">
                <div className="font-medium text-sm">{transaction.description}</div>
                {transaction.fromTo && (
                  <div className="text-xs text-muted-foreground">{transaction.fromTo}</div>
                )}
                <div className="text-xs text-muted-foreground">
                  {formatDate(transaction.timestamp)}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              {getAmountDisplay(transaction)}
            </div>
          </div>
        ))}
      </div>
      
      {transactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">אין עסקאות להציג</p>
        </div>
      )}
    </Card>
  );
};