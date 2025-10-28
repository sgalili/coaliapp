import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search } from "lucide-react";
import { ContactPicker } from "./ContactPicker";
import { TransactionConfirmation } from "./TransactionConfirmation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemoMode } from "@/hooks/useIsDemoMode";

interface SendZoozModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

interface Contact {
  id: string;
  name: string;
  username: string;
  phone?: string;
  avatar?: string;
  isFrequent?: boolean;
}

const mockContacts: Contact[] = [
  { id: "1", name: "דוד כהן", username: "@david_cohen", phone: "050-1234567", isFrequent: true },
  { id: "2", name: "שרה לוי", username: "@sarah_levi", phone: "052-9876543", isFrequent: true },
  { id: "3", name: "אמית רוזן", username: "@amit_rosen", phone: "053-5555555" },
  { id: "4", name: "נועה כץ", username: "@noa_katz", phone: "054-1111111" },
  { id: "5", name: "רחל גולן", username: "@rachel_golan", phone: "058-2222222" },
];

export const SendZoozModal = ({ isOpen, onClose, currentBalance }: SendZoozModalProps) => {
  const [step, setStep] = useState<"recipient" | "amount" | "confirm">("recipient");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [customRecipient, setCustomRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isDemoMode, getDemoUserId } = useIsDemoMode();
  const { toast: showToast } = useToast();

  const zoozAmount = amount ? parseInt(amount) : 0;
  const isValidAmount = zoozAmount > 0 && zoozAmount <= currentBalance;

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.includes(searchQuery) || 
    contact.username.includes(searchQuery) ||
    (contact.phone && contact.phone.includes(searchQuery))
  );

  const handleRecipientSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setCustomRecipient("");
  };

  const handleCustomRecipient = (value: string) => {
    setCustomRecipient(value);
    setSelectedContact(null);
  };

  const handleContinue = () => {
    if (step === "recipient" && (selectedContact || customRecipient)) {
      setStep("amount");
    } else if (step === "amount" && isValidAmount) {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "amount") {
      setStep("recipient");
    } else if (step === "confirm") {
      setStep("amount");
    }
  };

  const handleConfirm = async () => {
    if (isDemoMode) {
      const demoUserId = getDemoUserId();
      if (!demoUserId) return;

      // Create demo transaction
      const { error } = await supabase
        .from('demo_zooz_transactions' as any)
        .insert({
          from_user_id: demoUserId,
          to_user_id: null,
          amount: parseInt(amount),
          transaction_type: 'send',
          status: 'completed',
          description: 'שלחת Zooz',
          note: selectedContact?.name || customRecipient
        });

      if (error) {
        showToast({
          title: "שגיאה",
          description: "לא ניתן ליצור את ההעברה",
          variant: "destructive"
        });
        return;
      }
    }

    showToast({
      title: "העברה בוצעה בהצלחה",
      description: `שלחת ${amount} Zooz ל${selectedContact?.name || customRecipient}`,
    });
    
    // Transaction confirmed, close modal
    onClose();
    // Reset state
    setStep("recipient");
    setSelectedContact(null);
    setCustomRecipient("");
    setAmount("");
    setNote("");
    setSearchQuery("");
  };

  const recipient = selectedContact?.name || customRecipient;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          {step !== "recipient" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className="text-center">
            {step === "recipient" && "שליחת ZOOZ"}
            {step === "amount" && "סכום לשליחה"}
            {step === "confirm" && "אישור העברה"}
          </DialogTitle>
        </DialogHeader>

        {step === "recipient" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי שם, שם משתמש או מספר טלפון"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>


            {/* Contacts List */}
            <ContactPicker
              contacts={filteredContacts}
              selectedContact={selectedContact}
              onContactSelect={handleRecipientSelect}
            />

            <Button 
              onClick={handleContinue} 
              disabled={!selectedContact && !customRecipient}
              className="w-full"
            >
              המשך
            </Button>
          </div>
        )}

        {step === "amount" && (
          <div className="space-y-4">
            {/* Recipient Display */}
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="text-sm text-muted-foreground">שליחה אל</div>
              <div className="font-semibold">{recipient}</div>
            </div>

            {/* Balance Display */}
            <div className="text-center text-sm text-muted-foreground">
              יתרה זמינה: {currentBalance.toLocaleString()} Z
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>סכום</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="הכנס סכום"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-left pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  Z
                </span>
              </div>
              {zoozAmount > currentBalance && (
                <p className="text-sm text-destructive">יתרה לא מספיקה</p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label>הערה (אופציונלי)</Label>
              <Input
                placeholder="הוסף הערה..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleContinue} 
              disabled={!isValidAmount}
              className="w-full"
            >
              המשך
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <TransactionConfirmation
            recipient={recipient}
            amount={zoozAmount}
            note={note}
            onConfirm={handleConfirm}
            onCancel={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};