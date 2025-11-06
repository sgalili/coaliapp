import React, { useState, useEffect } from "react";
import { ArrowRight, Users, Share2, Copy, CheckCircle, Gift, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInvitation } from "@/hooks/useInvitation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock contacts data - in real app this would come from device contacts
const mockContacts = [
  { id: "1", name: "דני כהן", username: "@danny", phone: "+972-50-123-4567", avatar: "/src/assets/david-profile.jpg", isFrequent: true },
  { id: "2", name: "שרה לוי", username: "@sarah", phone: "+972-52-987-6543", avatar: "/src/assets/sarah-profile.jpg", isFrequent: true },
  { id: "3", name: "מיכל רוזן", username: "@michal", phone: "+972-54-555-0123", avatar: "/src/assets/maya-profile.jpg" },
];

const InviteFriendsPage = () => {
  const navigate = useNavigate();
  const [totalEarned] = useState(127); // Mock data - should come from backend
  const [copied, setCopied] = useState(false);
  
  const { referralCode, fetchReferralCode, generateInvitationLink } = useInvitation();
  
  useEffect(() => {
    fetchReferralCode();
  }, []);

  const referralLink = generateInvitationLink(referralCode || 'user123');

  const socialPlatforms = [
    { 
      name: "WhatsApp", 
      icon: "📱", 
      color: "bg-[#25D366]",
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`🎁 הצטרף אלי לרשת האמון Coali וקבל 10z מתנה!\n\n${referralLink}`)}`
    },
    { 
      name: "Facebook", 
      icon: "📘", 
      color: "bg-[#1877F2]",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
    },
    { 
      name: "Instagram", 
      icon: "📷", 
      color: "bg-gradient-to-br from-[#E4405F] to-[#FFDC80]"
    },
    { 
      name: "Telegram", 
      icon: "✈️", 
      color: "bg-[#0088CC]",
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('הצטרף אלי ל-Coali!')}`
    },
    { 
      name: "TikTok", 
      icon: "🎵", 
      color: "bg-black"
    },
    { 
      name: "X / Twitter", 
      icon: "🐦", 
      color: "bg-black",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`הצטרף אלי ל-Coali!\n${referralLink}`)}`
    }
  ];

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    if (platform.shareUrl) {
      window.open(platform.shareUrl, "_blank");
    } else {
      handleCopyLink();
      toast.success(`קישור הועתק עבור ${platform.name}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("קישור הועתק! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted pb-20" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">הזמן חברים</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Rewards Section */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 via-background to-zooz/10 border-2 border-primary/20">
          <div className="text-center mb-6">
            <Gift className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">הזמן חברים וקבל תגמולים</h2>
            <p className="text-muted-foreground">
              על כל חבר שמצטרף עם הקישור האישי שלך תקבל:
            </p>
          </div>

          {/* 3-Tier Rewards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-1">5</div>
              <div className="text-xs text-green-700 font-medium">דור ראשון</div>
              <div className="text-sm font-bold text-green-600">זוז</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-1">2</div>
              <div className="text-xs text-blue-700 font-medium">דור שני</div>
              <div className="text-sm font-bold text-blue-600">זוז</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-1">1</div>
              <div className="text-xs text-purple-700 font-medium">דור שלישי</div>
              <div className="text-sm font-bold text-purple-600">זוז</div>
            </div>
          </div>

          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-900 font-medium">
              החבר שלך יקבל גם 10 זוז מתנה 🎁
            </p>
          </div>
        </Card>

        {/* Personal Referral Code */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-3">הקוד האישי שלך</h3>
          <div className="bg-muted p-4 rounded-lg mb-3">
            <code className="text-lg font-mono text-primary break-all" dir="ltr">
              {referralLink}
            </code>
          </div>
          <Button
            onClick={handleCopyLink}
            className="w-full"
            variant={copied ? "secondary" : "default"}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                הועתק!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                העתק קישור
              </>
            )}
          </Button>
        </Card>

        {/* Social Sharing */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">שיתוף מהיר</h3>
          <div className="grid grid-cols-3 gap-3">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl text-white transition-transform hover:scale-105",
                  platform.color
                )}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-xs font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Total Earned */}
        <Card className="p-6 bg-gradient-to-br from-zooz/20 to-yellow-50 border-2 border-zooz/30">
          <div className="text-center">
            <Sparkles className="w-10 h-10 text-zooz mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">כבר הרווחת</p>
            <p className="text-4xl font-bold text-zooz">{totalEarned}z</p>
            <p className="text-xs text-muted-foreground mt-1">מהזמנות</p>
          </div>
        </Card>
      </div>

      <Navigation zoozBalance={9957} />
    </div>
  );
};

export default InviteFriendsPage;