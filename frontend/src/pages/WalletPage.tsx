import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Settings, Send, Download, CreditCard, Building2, TrendingUp, X, Search, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Demo users for sending
const demoUsers = [
  { id: '1', name: 'נועה רותם', avatar: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg', verified: true, trust: 3200, isRecent: true },
  { id: '2', name: 'דוד לוי', avatar: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg', verified: true, trust: 5100, isRecent: true },
  { id: '3', name: 'רחל כהן', avatar: 'https://trust.coali.app/assets/rachel-profile-w3gZXC9S.jpg', verified: true, trust: 2400, isRecent: false },
  { id: '4', name: 'אמית ברק', avatar: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg', verified: true, trust: 1800, isRecent: false },
  { id: '5', name: 'מיכל שמיר', avatar: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg', verified: false, trust: 1200, isRecent: false },
  { id: '6', name: 'יוסי בן-דוד', avatar: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg', verified: false, trust: 980, isRecent: false },
  { id: '7', name: 'תמר פרץ', avatar: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg', verified: true, trust: 1500, isRecent: false },
];

// Demo wallet data
const walletData = {
  balance: 9957,
  usdValue: 127.43,
  weeklyChange: 2.3,
  totalEarned: 18940,
  totalSent: 2360,
  totalReceived: 4100,
};

// Generate demo transactions
const generateTransactions = () => {
  const types = [
    { type: 'earned', icon: '💬', title: 'תגובה על חדשות', amount: 10, time: '29.10, 10:00' },
    { type: 'received', icon: '🎉', title: 'חבר חדש הצטרף', subtitle: 'דוד כהן', amount: 5, time: '29.10, 08:30' },
    { type: 'sent', icon: '📤', title: 'העברה', subtitle: 'שרה לוי', amount: -25, time: '28.10, 10:30' },
    { type: 'earned', icon: '💳', title: 'רכישת ZOOZ', amount: 100, time: '27.10, 10:30' },
    { type: 'earned', icon: '📊', title: 'השתתפות בסקר', amount: 1, time: '26.10, 10:30' },
    { type: 'earned', icon: '🎁', title: 'הרווחת Zooz מפוסט', amount: 250, time: '25.10, 15:00' },
    { type: 'trust', icon: '🤝', title: 'בונוס אמון', subtitle: '10 אנשים נתנו אמון', amount: 150, time: '25.10, 10:00' },
    { type: 'received', icon: '👤', title: 'קיבלת מ-נועה רותם', subtitle: 'תודה על הפוסט', amount: 500, time: '24.10, 16:00' },
    { type: 'sent', icon: '📤', title: 'שלחת ל-דוד ישראלי', subtitle: 'בהצלחה', amount: -300, time: '24.10, 12:00' },
    { type: 'earned', icon: '⭐', title: 'הרווחת Zooz מתגובה', amount: 180, time: '23.10, 18:00' },
  ];

  return types.map((tx, idx) => ({ ...tx, id: `tx-${idx}` }));
};

type FilterType = 'all' | 'earned' | 'sent' | 'received';

export default function WalletPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState(generateTransactions());
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [balance, setBalance] = useState(walletData.balance);
  
  // Send Zooz modal states
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendStep, setSendStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [sendAmount, setSendAmount] = useState('');
  const [sendNote, setSendNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  
  // Request Zooz modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [requestNote, setRequestNote] = useState('');
  
  // Buy/Withdraw modals
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const filteredUsers = demoUsers.filter(user =>
    user.name.includes(searchQuery)
  );

  const recentUsers = filteredUsers.filter(u => u.isRecent);
  const followingUsers = filteredUsers.filter(u => !u.isRecent);

  const handleSendZooz = async () => {
    const amount = parseInt(sendAmount);
    if (!amount || amount <= 0 || amount > balance) return;

    setSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update balance
    setBalance(prev => prev - amount);
    
    // Add transaction
    const newTransaction = {
      id: `tx-new-${Date.now()}`,
      type: 'sent',
      icon: '📤',
      title: `שלחת ל-${selectedUser.name}`,
      subtitle: sendNote || undefined,
      amount: -amount,
      time: 'עכשיו',
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Reset and close
    setSending(false);
    setShowSendModal(false);
    setSendStep(1);
    setSelectedUser(null);
    setSendAmount('');
    setSendNote('');
    
    // Success toast
    toast({
      title: "✅ הועבר בהצלחה!",
      description: `${amount} Zooz נשלח ל-${selectedUser.name}`,
    });
  };

  const copyRequestLink = () => {
    const link = `https://trust.coali.app/pay/${Math.random().toString(36).substring(7)}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "הועתק!",
      description: "הקישור הועתק ללוח",
    });
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'earned') return tx.type === 'earned' || tx.type === 'trust';
    if (filter === 'sent') return tx.type === 'sent';
    if (filter === 'received') return tx.type === 'received';
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">ארנק ZOOZ</h1>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-zooz via-yellow-400 to-orange-400 rounded-2xl p-6 mb-4 shadow-lg relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-50" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💰</span>
              <p className="text-zooz-foreground/80 font-medium text-sm">Zooz Balance</p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <p className="text-5xl font-bold text-zooz-foreground">{walletData.balance.toLocaleString()}</p>
              <span className="text-2xl font-bold text-zooz-foreground/80">Z</span>
            </div>
            <p className="text-sm text-zooz-foreground/70 mb-2">${walletData.usdValue.toFixed(2)} USD</p>
            <div className="flex items-center gap-2 text-zooz-foreground/80">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium text-trust">+{walletData.weeklyChange}%</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setFilter('earned')}
            className={cn(
              "p-4 bg-card border rounded-xl transition-all",
              filter === 'earned' ? "border-primary shadow-sm" : "border-border hover:bg-muted/30"
            )}
          >
            <div className="text-2xl mb-2">🎁</div>
            <p className="text-xs text-muted-foreground mb-1">הרווחתי</p>
            <p className="text-lg font-bold text-foreground">{walletData.totalEarned.toLocaleString()}</p>
          </button>

          <button
            onClick={() => setFilter('sent')}
            className={cn(
              "p-4 bg-card border rounded-xl transition-all",
              filter === 'sent' ? "border-primary shadow-sm" : "border-border hover:bg-muted/30"
            )}
          >
            <div className="text-2xl mb-2">📤</div>
            <p className="text-xs text-muted-foreground mb-1">שלחתי</p>
            <p className="text-lg font-bold text-foreground">{walletData.totalSent.toLocaleString()}</p>
          </button>

          <button
            onClick={() => setFilter('received')}
            className={cn(
              "p-4 bg-card border rounded-xl transition-all",
              filter === 'received' ? "border-primary shadow-sm" : "border-border hover:bg-muted/30"
            )}
          >
            <div className="text-2xl mb-2">📥</div>
            <p className="text-xs text-muted-foreground mb-1">קיבלתי</p>
            <p className="text-lg font-bold text-foreground">{walletData.totalReceived.toLocaleString()}</p>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex flex-col items-center gap-3 p-5 bg-card border-2 border-primary hover:bg-primary/5 rounded-xl transition-all">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
              <Send className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">העברה</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-5 bg-card border-2 border-watch hover:bg-watch/5 rounded-xl transition-all">
            <div className="w-14 h-14 bg-watch rounded-full flex items-center justify-center">
              <Download className="w-7 h-7 text-watch-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">בקשה</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-5 bg-card border-2 border-trust hover:bg-trust/5 rounded-xl transition-all">
            <div className="w-14 h-14 bg-trust rounded-full flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-trust-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">קניה</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-5 bg-card border-2 border-border hover:bg-muted/30 rounded-xl transition-all">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center">
              <Building2 className="w-7 h-7 text-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">משיכה</span>
          </button>
        </div>

        {/* Earn More Banner */}
        <div className="bg-gradient-to-r from-zooz/10 to-orange-100/50 rounded-xl p-4 mb-6 border border-zooz/20">
          <h3 className="text-base font-semibold text-foreground">גלה איך להרוויח יותר זוז</h3>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">היסטוריית עסקאות</h3>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all' as FilterType, label: 'הכל' },
              { id: 'earned' as FilterType, label: 'הרווחתי' },
              { id: 'sent' as FilterType, label: 'שלחתי' },
              { id: 'received' as FilterType, label: 'קיבלתי' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  filter === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            {filteredTransactions.map((tx) => (
              <button
                key={tx.id}
                onClick={() => setSelectedTransaction(tx)}
                className="w-full flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted/30 transition-colors text-right"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{tx.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{tx.title}</p>
                    {tx.subtitle && (
                      <p className="text-xs text-muted-foreground">{tx.subtitle}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
                <div className={cn(
                  "text-base font-bold whitespace-nowrap",
                  tx.amount > 0 ? 'text-trust' : 'text-destructive'
                )}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}Z
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-background w-full md:max-w-lg md:rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">פרטי עסקה</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">{selectedTransaction.icon}</div>
              
              <p className="text-lg font-semibold text-foreground mb-2">
                {selectedTransaction.title}
              </p>
              
              {selectedTransaction.subtitle && (
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedTransaction.subtitle}
                </p>
              )}

              <div className={cn(
                "text-4xl font-bold mb-4",
                selectedTransaction.amount > 0 ? 'text-trust' : 'text-destructive'
              )}>
                {selectedTransaction.amount > 0 ? '+' : ''}{selectedTransaction.amount}Z
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{selectedTransaction.time}</p>
                <p>סטטוס: ✓ הושלם</p>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation zoozBalance={walletData.balance} />
    </div>
  );
}
