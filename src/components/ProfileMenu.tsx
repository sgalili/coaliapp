import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        { icon: Bell, label: "התראות", action: () => navigate("/notifications-settings") },
        { icon: Globe, label: "שפה", action: () => console.log("Language") },
        { icon: Lock, label: "הגדרות פרטיות", action: () => console.log("Privacy") },
        { icon: Shield, label: "הנתונים שלי", action: () => navigate("/data-management") },
      ]
    },
    {
      category: "קהילה ושיתוף",
      items: [
        { icon: UserPlus, label: "הזמן חברים", action: () => console.log("Invite Friends") },
        { icon: BarChart3, label: "הסטטיסטיקות שלי", action: () => console.log("Personal Stats") },
      ]
    },
    {
      category: "תמיכה ועזרה",
      items: [
        { icon: MessageCircle, label: "יצירת קשר ומשוב", action: () => window.open("https://wa.me/972123456789", "_blank") },
        { icon: Heart, label: "תרומות ותמיכה", action: () => window.open("https://israel3.org.il", "_blank") },
        { icon: ShoppingBag, label: "Marketplace", action: () => window.open("https://lazooz.co", "_blank") },
        { icon: HelpCircle, label: "מרכז עזרה", action: () => console.log("Help Center") },
      ]
    },
    {
      category: "הגדרות מערכת",
      items: [
        { icon: Moon, label: "מצב לילה", action: () => console.log("Dark Mode") },
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
        
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-4 pr-4">
            {menuItems.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-right">
                  {category.category}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      className="w-full justify-between h-auto p-2 text-right"
                      onClick={() => handleItemClick(item.action)}
                    >
                      <ChevronRight className="w-4 h-4" />
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">{item.label}</div>
                        </div>
                        <item.icon className="w-5 h-5" />
                      </div>
                    </Button>
                  ))}
                </div>
                {categoryIndex < menuItems.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
            
            <Separator />
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleItemClick(() => navigate("/"))}
            >
              <LogOut className="w-5 h-5 ml-3" />
              <div className="text-right">
                <div className="font-medium">התנתק</div>
              </div>
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileMenu;