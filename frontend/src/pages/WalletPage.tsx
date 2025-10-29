import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Wallet, Send, Download, CreditCard, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const actionButtons = [
  { id: 'send', label: 'Send Zooz', icon: Send, color: 'bg-primary' },
  { id: 'request', label: 'Request Zooz', icon: Download, color: 'bg-watch' },
  { id: 'buy', label: 'Buy Zooz', icon: CreditCard, color: 'bg-trust' },
  { id: 'withdraw', label: 'Withdraw Zooz', icon: Building2, color: 'bg-muted' },
];

const placeholderTransactions = [
  { id: '1', type: 'received', description: 'קיבלת Zooz מיוסי כהן', amount: '+250', time: 'לפני 2 שעות', icon: '🎉' },
  { id: '2', type: 'sent', description: 'שלחת Zooz לשרה לוי', amount: '-300', time: 'לפני 5 שעות', icon: '📤' },
  { id: '3', type: 'earned', description: 'הרווחת Zooz מפוסט', amount: '+180', time: 'לפני 8 שעות', icon: '⭐' },
  { id: '4', type: 'received', description: 'קיבלת Zooz מדוד ישראלי', amount: '+420', time: 'לפני יום', icon: '🎉' },
  { id: '5', type: 'earned', description: 'הרווחת Zooz מתגובה', amount: '+90', time: 'לפני יומיים', icon: '💬' },
];

export default function WalletPage() {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">ארנק Zooz</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-zooz via-yellow-400 to-orange-400 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">💰</span>
            <p className="text-zooz-foreground/80 font-medium">Zooz Balance</p>
          </div>
          <p className="text-5xl font-bold text-zooz-foreground mb-3">15,680</p>
          <div className="flex items-center gap-2 text-zooz-foreground/80">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">+340 השבוע זה</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {actionButtons.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary transition-colors bg-card",
                  "hover:shadow-md"
                )}
              >
                <div className={cn(action.color, "w-12 h-12 rounded-full flex items-center justify-center")}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Transactions List */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <span>עסקאות אחרונות</span>
          </h2>
          
          <div className="space-y-2">
            {placeholderTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:bg-muted/30 transition-colors"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span>{tx.icon}</span>
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>

                {/* Amount */}
                <div className={cn(
                  "font-bold text-lg",
                  tx.amount.startsWith('+') ? "text-trust" : "text-destructive"
                )}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={250} />
    </div>
  );
}
