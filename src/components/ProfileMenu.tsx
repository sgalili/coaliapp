import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, UserPlus, Globe, Shield, MessageCircle, Heart, ShoppingBag, Moon, HelpCircle, LogOut, BarChart3, Lock, ChevronRight, Check, Copy, QrCode, Languages, Eye, EyeOff, Volume2, VolumeX, Download, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileMenuProps {
  onClose?: () => void;
}

export const ProfileMenu = ({ onClose }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("עברית");
  const navigate = useNavigate();

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText("SARAH2024");
    toast.success("קוד הפניה הועתק!", {
      description: "SARAH2024 הועתק ללוח"
    });
  };

  const handleShowQRCode = () => {
    toast.info("QR Code", {
      description: "פתיחת קוד QR לשיתוף הפרופיל"
    });
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(notificationsEnabled ? "התראות כובו" : "התראות הופעלו");
  };

  const handleLanguageChange = () => {
    const languages = ["עברית", "English", "العربية"];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    setCurrentLanguage(nextLanguage);
    toast.success(`שפה שונתה ל-${nextLanguage}`);
  };

  const handlePrivacyToggle = () => {
    setProfileVisible(!profileVisible);
    toast.success(profileVisible ? "פרופיל הוסתר" : "פרופיל חשוף");
  };

  const handleExportData = () => {
    toast.success("ייצוא נתונים", {
      description: "הנתונים שלך נשלחו לאימייל"
    });
  };

  const handleShowStats = () => {
    toast.info("סטטיסטיקות", {
      description: "צפייה בנתונים אישיים"
    });
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(darkMode ? "מצב בהיר הופעל" : "מצב כהה הופעל");
  };

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast.success(soundEnabled ? "צלילים כובו" : "צלילים הופעלו");
  };

  const menuItems = [
    {
      category: "הגדרות אישיות",
      items: [
        { 
          icon: Bell, 
          label: "התראות", 
          action: handleToggleNotifications,
          hasToggle: true,
          toggleValue: notificationsEnabled
        },
        { 
          icon: Languages, 
          label: `שפה (${currentLanguage})`, 
          action: handleLanguageChange 
        },
        { 
          icon: profileVisible ? Eye : EyeOff, 
          label: "הגדרות פרטיות", 
          action: handlePrivacyToggle,
          hasToggle: true,
          toggleValue: profileVisible
        },
        { 
          icon: Shield, 
          label: "הנתונים שלי", 
          action: () => navigate("/data-management") 
        },
        { 
          icon: Download, 
          label: "ייצוא נתונים", 
          action: handleExportData 
        },
      ]
    },
    {
      category: "קהילה ושיתוף",
      items: [
        { 
          icon: Copy, 
          label: "העתק קוד הפניה", 
          action: handleCopyReferralCode,
          badge: "SARAH2024"
        },
        { 
          icon: QrCode, 
          label: "QR Code לפרופיל", 
          action: handleShowQRCode 
        },
        { 
          icon: BarChart3, 
          label: "הסטטיסטיקות שלי", 
          action: handleShowStats 
        },
      ]
    },
    {
      category: "תמיכה ועזרה",
      items: [
        { 
          icon: MessageCircle, 
          label: "יצירת קשר ומשוב", 
          action: () => window.open("https://wa.me/972123456789", "_blank") 
        },
        { 
          icon: Heart, 
          label: "תרומות ותמיכה", 
          action: () => window.open("https://israel3.org.il", "_blank") 
        },
        { 
          icon: ShoppingBag, 
          label: "Marketplace", 
          action: () => window.open("https://lazooz.co", "_blank") 
        },
        { 
          icon: HelpCircle, 
          label: "מרכז עזרה", 
          action: () => toast.info("פתיחת מרכז עזרה") 
        },
      ]
    },
    {
      category: "הגדרות מערכת",
      items: [
        { 
          icon: Moon, 
          label: "מצב לילה", 
          action: handleToggleDarkMode,
          hasToggle: true,
          toggleValue: darkMode
        },
        { 
          icon: soundEnabled ? Volume2 : VolumeX, 
          label: "צלילים", 
          action: handleToggleSound,
          hasToggle: true,
          toggleValue: soundEnabled
        },
      ]
    }
  ];

  const handleItemClick = (action: () => void) => {
    action();
    // Ne pas fermer automatiquement pour les toggles
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 overflow-y-auto" dir="rtl">
        <SheetHeader>
          <SheetTitle className="text-right">הגדרות הפרופיל</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-4 pb-6">
          {menuItems.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                {category.category}
              </h3>
              <div className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => !item.hasToggle && handleItemClick(item.action)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    
                    {item.hasToggle ? (
                      <Switch
                        checked={item.toggleValue}
                        onCheckedChange={() => handleItemClick(item.action)}
                      />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
              {categoryIndex < menuItems.length - 1 && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
          
          <Separator />
          
          {/* Logout Button */}
          <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
            onClick={() => {
              navigate("/");
              setIsOpen(false);
              onClose?.();
            }}
          >
            <LogOut className="w-4 h-4 text-destructive" />
            <span className="font-medium text-sm text-destructive">התנתק</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileMenu;