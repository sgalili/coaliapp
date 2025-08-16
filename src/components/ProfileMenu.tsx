import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, UserPlus, Globe, Shield, MessageCircle, Heart, ShoppingBag, Moon, HelpCircle, LogOut, BarChart3, Lock, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ProfileMenuProps {
  onClose?: () => void;
}

export const ProfileMenu = ({ onClose }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      category: "הגדרות אישיות",
      items: [
        { icon: Bell, label: "התראות", description: "נהל התראות ועדכונים", action: () => console.log("Notifications") },
        { icon: Globe, label: "שפה", description: "בחר את השפה המועדפת", action: () => console.log("Language") },
        { icon: Lock, label: "הגדרות פרטיות", description: "מי יכול לראות את הפרופיל", action: () => console.log("Privacy") },
        { icon: Shield, label: "הנתונים שלי", description: "נהל את הנתונים השמורים", action: () => console.log("Data Privacy") },
      ]
    },
    {
      category: "קהילה ושיתוף",
      items: [
        { icon: UserPlus, label: "הזמן חברים", description: "שתף את הקוד האישי שלך", action: () => console.log("Invite Friends") },
        { icon: BarChart3, label: "הסטטיסטיקות שלי", description: "צפה בהתקדמות והישגים", action: () => console.log("Personal Stats") },
      ]
    },
    {
      category: "תמיכה ועזרה",
      items: [
        { icon: MessageCircle, label: "יצירת קשר ומשוב", description: "דבר איתנו בוואטסאפ", action: () => window.open("https://wa.me/972123456789", "_blank") },
        { icon: Heart, label: "תרומות ותמיכה", description: "תמוך במטרות חשובות", action: () => window.open("https://israel3.org.il", "_blank") },
        { icon: ShoppingBag, label: "Marketplace", description: "קנה ומכור עם ZOOZ", action: () => window.open("https://lazooz.co", "_blank") },
        { icon: HelpCircle, label: "מרכז עזרה", description: "שאלות נפוצות ומדריכים", action: () => console.log("Help Center") },
      ]
    },
    {
      category: "הגדרות מערכת",
      items: [
        { icon: Moon, label: "מצב לילה", description: "החלף בין מצב בהיר וכהה", action: () => console.log("Dark Mode") },
      ]
    }
  ];

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80" dir="rtl">
        <SheetHeader>
          <SheetTitle className="text-right">הגדרות הפרופיל</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {menuItems.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {category.category}
              </h3>
              <div className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className="w-full justify-between h-auto p-3 text-right"
                    onClick={() => handleItemClick(item.action)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <div className="text-right">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ))}
              </div>
              {categoryIndex < menuItems.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
          
          <Separator />
          
          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => handleItemClick(() => navigate("/"))}
          >
            <LogOut className="w-5 h-5 ml-3" />
            <div className="text-right">
              <div className="font-medium">התנתק</div>
              <div className="text-xs opacity-75">יציאה מהחשבון</div>
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileMenu;