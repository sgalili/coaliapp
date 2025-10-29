import React, { useState, useEffect } from "react";
import { ArrowRight, Users, Share2, Copy, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { ContactPicker } from "@/components/ContactPicker";
import { useInvitation } from "@/hooks/useInvitation";
import { toast } from "sonner";

// Mock contacts data - in real app this would come from device contacts
const mockContacts = [
  { id: "1", name: "דני כהן", username: "@danny", phone: "+972-50-123-4567", avatar: "/src/assets/david-profile.jpg", isFrequent: true },
  { id: "2", name: "שרה לוי", username: "@sarah", phone: "+972-52-987-6543", avatar: "/src/assets/sarah-profile.jpg", isFrequent: true },
  { id: "3", name: "מיכל רוזן", username: "@michal", phone: "+972-54-555-0123", avatar: "/src/assets/maya-profile.jpg" },
];

const InviteFriendsPage = () => {
  const navigate = useNavigate();
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [totalEarned] = useState(127); // Mock data
  
  const { referralCode, fetchReferralCode, generateInvitationLink, createTrustIntent, isLoading } = useInvitation();
  
  // Fetch user's referral code on mount
  useEffect(() => {
    fetchReferralCode();
  }, []);

  // Generate personal referral link using real referral code
  const referralLink = generateInvitationLink(referralCode || undefined);

  const socialPlatforms = [
    { name: "WhatsApp", color: "bg-[#25D366]", icon: "📱", shareUrl: `https://wa.me/?text=${encodeURIComponent(`הצטרף לזוז עם הקישור שלי: ${referralLink}`)}` },
    { name: "Facebook", color: "bg-[#1877F2]", icon: "📘", shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}` },
    { name: "Instagram", color: "bg-gradient-to-br from-[#E4405F] to-[#FFDC80]", icon: "📷", shareUrl: "" },
    { name: "Telegram", color: "bg-[#0088CC]", icon: "✈️", shareUrl: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}` },
    { name: "TikTok", color: "bg-black", icon: "🎵", shareUrl: "" },
    { name: "X / Twitter", color: "bg-black", icon: "🐦", shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`הצטרף לזוז עם הקישור שלי: ${referralLink}`)}` },
  ];

  const handleContactsPermission = () => {
    // Simulate checking permissions
    const hasPermission = Math.random() > 0.5; // Mock permission check
    
    if (hasPermission) {
      setShowContactPicker(true);
    } else {
      setShowPermissionDialog(true);
    }
  };

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    if (platform.shareUrl) {
      window.open(platform.shareUrl, "_blank");
    } else {
      // For platforms without direct web sharing, copy to clipboard
      handleCopyLink();
      toast.success(`קישור הועתק עבור ${platform.name}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("קישור הועתק ללוח!");
  };

  const handleContactSelect = async (contact: any) => {
    setSelectedContact(contact);
    setShowContactPicker(false);
    
    // Create trust intent for the selected contact
    const success = await createTrustIntent(contact.phone);
    
    if (success) {
      toast.success(`אמון נוצר עבור ${contact.name} - עכשיו הם יכולים להירשם!`);
    } else {
      toast.error(`שגיאה ביצירת אמון עבור ${contact.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="shrink-0"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">הזמן חברים</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Title and Description */}
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            הזמן חברים וקבל תגמולים
          </h2>
          
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground mb-4">
              על כל חבר שמצטרף עם הקישור האישי שלך תקבל:
            </p>
            
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-primary">5</span>
                </div>
                <p className="text-xs text-muted-foreground">דור ראשון</p>
                <p className="text-xs font-medium">זוז</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <p className="text-xs text-muted-foreground">דור שני</p>
                <p className="text-xs font-medium">זוז</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <p className="text-xs text-muted-foreground">דור שלישי</p>
                <p className="text-xs font-medium">זוז</p>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-sm font-medium">
                החבר שלך יקבל גם 10 זוז מתנה 🎁
              </p>
            </div>
          </div>
        </Card>

        {/* QR Code Section */}
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">הקוד האישי שלך</h3>
            
            <div className="flex justify-center mb-4">
              <QRCodeDisplay value={referralLink} size={200} />
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-sm text-muted-foreground mb-2">הקישור האישי שלך לשיתוף:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background px-2 py-1 rounded border break-all">
                  {referralLink}
                </code>
                <Button size="sm" variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Share Buttons */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">שיתוף מהיר</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform)}
                className={`${platform.color} text-white rounded-full p-4 aspect-square flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95`}
              >
                <span className="text-2xl mb-1">{platform.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">
                  {platform.name}
                </span>
              </button>
            ))}
            
            <button
              onClick={handleCopyLink}
              className="bg-muted hover:bg-muted/80 rounded-full p-4 aspect-square flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
            >
              <Copy className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">העתק קישור</span>
            </button>
          </div>
        </Card>

        {/* Contact Picker Button */}
        <Card className="p-6">
          <Button
            onClick={handleContactsPermission}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            <Users className="ml-2 h-5 w-5" />
            בחר אנשי קשר מהטלפון
          </Button>
        </Card>

        {/* Earnings Footer */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              כבר הרווחת {totalEarned} זוז מהזמנות
            </span>
          </div>
        </div>
      </div>

      {/* Contact Picker Modal */}
      <Dialog open={showContactPicker} onOpenChange={setShowContactPicker}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>בחר אנשי קשר</DialogTitle>
            <DialogDescription>
              בחר חברים שתרצה להזמין לזוז
            </DialogDescription>
          </DialogHeader>
          <ContactPicker
            contacts={mockContacts}
            selectedContact={selectedContact}
            onContactSelect={handleContactSelect}
          />
        </DialogContent>
      </Dialog>

      {/* Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>גישה לאנשי קשר</DialogTitle>
            <DialogDescription>
              כדי להזמין חברים יש לאפשר גישה לאנשי קשר
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setShowPermissionDialog(false)}>
              פתח הגדרות
            </Button>
            <Button variant="outline" onClick={() => setShowPermissionDialog(false)}>
              ביטול
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteFriendsPage;