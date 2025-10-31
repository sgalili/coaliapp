import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, History, Gift, Coins, ArrowUpRight, ArrowDownLeft, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoozWalletProps {
  balance: number;
  onClose: () => void;
  onSend: (recipient: string, amount: number) => void;
}

const mockTransactions = [
  {
    id: "1",
    type: "received",
    amount: 50,
    from: "יוסי_כהן",
    description: "הפניה - רמה 1",
    timestamp: "לפני שעה",
    status: "completed"
  },
  {
    id: "2", 
    type: "sent",
    amount: 25,
    to: "שרה_לוי",
    description: "העברה",
    timestamp: "לפני 3 שעות",
    status: "completed"
  },
  {
    id: "3",
    type: "received",
    amount: 100,
    from: "מערכת",
    description: "בונוס שבועי",
    timestamp: "לפני יום",
    status: "completed"
  }
];

const mockReferrals = [
  {
    id: "1",
    name: "דני_אברהם",
    level: 1,
    joinDate: "לפני 2 ימים",
    earnings: 50,
    status: "active"
  },
  {
    id: "2",
    name: "מיכל_רוזן",
    level: 2,
    joinDate: "לפני שבוע",
    earnings: 25,
    status: "active"
  }
];

export const ZoozWallet = ({ balance, onClose, onSend }: ZoozWalletProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [inviteLink] = useState("https://trust.network/invite/abc123");

  const handleSend = () => {
    const amount = parseFloat(sendAmount);
    if (amount > 0 && amount <= balance && recipient) {
      onSend(recipient, amount);
      setSendAmount("");
      setRecipient("");
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    // Could add toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Coins className="w-6 h-6 text-zooz" />
              ארנק ZOOZ
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Balance Overview */}
          <Card className="p-6 bg-gradient-to-l from-zooz/10 to-zooz/5 border-zooz/20">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">יתרה נוכחית</p>
              <div className="text-4xl font-bold text-zooz">{balance.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">ZOOZ Tokens</p>
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">סקירה</TabsTrigger>
              <TabsTrigger value="send">שלח</TabsTrigger>
              <TabsTrigger value="referrals">הפניות</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">היסטוריית עסקאות</h3>
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 ml-1" />
                    הכל
                  </Button>
                </div>
                
                {mockTransactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          transaction.type === "received" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-red-500/10 text-red-500"
                        )}>
                          {transaction.type === "received" ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.type === "received" ? `מ${transaction.from}` : `ל${transaction.to}`}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className={cn(
                          "font-bold",
                          transaction.type === "received" ? "text-green-500" : "text-red-500"
                        )}>
                          {transaction.type === "received" ? "+" : "-"}{transaction.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="send" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">שלח ZOOZ</h3>
                
                <div>
                  <Label htmlFor="recipient">למי לשלוח</Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      placeholder="שם משתמש או אימייל"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="text-right pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount">כמות</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="text-right"
                    max={balance}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    יתרה: {balance.toLocaleString()} ZOOZ
                  </p>
                </div>

                <div className="flex gap-2">
                  {[10, 50, 100].map((amount) => (
                    <Button 
                      key={amount}
                      variant="outline" 
                      size="sm"
                      onClick={() => setSendAmount(amount.toString())}
                      className="flex-1"
                    >
                      {amount}
                    </Button>
                  ))}
                </div>

                <Button 
                  onClick={handleSend}
                  disabled={!recipient || !sendAmount || parseFloat(sendAmount) > balance}
                  className="w-full"
                >
                  <Send className="w-4 h-4 ml-2" />
                  שלח {sendAmount} ZOOZ
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">תוכנית הפניות</h3>
                
                <Card className="p-4 bg-gradient-to-l from-primary/10 to-primary/5 border-primary/20">
                  <div className="space-y-3">
                    <h4 className="font-medium">הזמן חברים וקבל ZOOZ</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• רמה 1: 50 ZOOZ עבור כל חבר שנרשם</li>
                      <li>• רמה 2: 25 ZOOZ עבור כל חבר של חבר</li>
                      <li>• רמה 3: 10 ZOOZ עבור כל חבר של חבר של חבר</li>
                    </ul>
                    <div className="flex gap-2">
                      <Input
                        value={inviteLink}
                        readOnly
                        className="text-right text-xs"
                      />
                      <Button onClick={copyInviteLink} variant="outline">
                        העתק
                      </Button>
                    </div>
                  </div>
                </Card>

                <div className="space-y-3">
                  <h4 className="font-medium">ההפניות שלך</h4>
                  {mockReferrals.map((referral) => (
                    <Card key={referral.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Gift className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{referral.name}</p>
                            <p className="text-sm text-muted-foreground">
                              רמה {referral.level} • נרשם {referral.joinDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-green-500">+{referral.earnings}</p>
                          <Badge variant="secondary" className="text-xs">
                            {referral.status === "active" ? "פעיל" : "לא פעיל"}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};