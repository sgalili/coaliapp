import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Settings } from "lucide-react";

const transactions = [
  { id: '1', type: 'earn', title: 'תגובה על חדשות', date: '29.10, 10:00', amount: '+10', icon: '💬' },
  { id: '2', type: 'earn', title: 'חבר חדש הצטרף', subtitle: 'דוד כהן', date: '29.10, 08:30', amount: '+5', icon: '🎉' },
  { id: '3', type: 'send', title: 'העברה', subtitle: 'שרה לוי', date: '28.10, 10:30', amount: '-25', icon: '📤' },
  { id: '4', type: 'earn', title: 'רכישת ZOOZ', date: '27.10, 10:30', amount: '+100', icon: '💳' },
  { id: '5', type: 'earn', title: 'השתתפות בסקר', date: '26.10, 10:30', amount: '+1', icon: '📊' },
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
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">ארנק ZOOZ</h1>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Balance Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-bold text-foreground">9,957</span>
            <span className="text-2xl font-bold text-zooz">Z</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">$127.43 USD</p>
          <p className="text-xs text-trust font-medium">+2.3%</p>
        </div>

        {/* Action Buttons - 4 in a row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💳</span>
            </div>
            <span className="text-xs font-medium text-center text-foreground">קניה</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 bg-watch rounded-full flex items-center justify-center">
              <span className="text-white text-lg">📥</span>
            </div>
            <span className="text-xs font-medium text-center text-foreground">בקשה</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 bg-trust rounded-full flex items-center justify-center">
              <span className="text-white text-lg">📤</span>
            </div>
            <span className="text-xs font-medium text-center text-foreground">העברה</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <span className="text-foreground text-lg">🏦</span>
            </div>
            <span className="text-xs font-medium text-center text-foreground">משיכה</span>
          </button>
        </div>

        {/* Earn More Section */}
        <div className="bg-gradient-to-br from-zooz/10 to-orange-100/50 rounded-xl p-4 mb-6 border border-zooz/20">
          <h3 className="text-base font-semibold text-foreground mb-1">גלה איך להרוויח יותר זוז</h3>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">היסטוריית עסקאות</h3>
          
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{tx.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{tx.title}</p>
                    {tx.subtitle && (
                      <p className="text-xs text-muted-foreground">{tx.subtitle}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className={`text-base font-bold ${tx.amount.startsWith('+') ? 'text-trust' : 'text-destructive'}`}>
                  {tx.amount}Z
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={9957} />
    </div>
  );
}
