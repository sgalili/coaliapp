import { TrendingUp } from "lucide-react";

interface WalletBalanceProps {
  zoozBalance: number;
  usdValue: number;
  percentageChange: number;
}

export const WalletBalance = ({ zoozBalance, usdValue, percentageChange }: WalletBalanceProps) => {
  const isPositive = percentageChange >= 0;

  return (
    <div className="py-6 px-4">
      <div className="text-center">
        <div className="mb-2">
          <span className="text-3xl font-bold">{zoozBalance.toLocaleString()}</span>
          <span className="text-xl text-muted-foreground mr-2">Z</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-muted-foreground">
            ${usdValue.toFixed(2)} USD
          </span>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-3 h-3 ${!isPositive ? 'rotate-180' : ''}`} />
            <span className="text-xs font-medium">
              {isPositive ? '+' : ''}{percentageChange.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};