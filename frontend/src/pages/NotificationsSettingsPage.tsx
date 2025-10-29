import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ArrowRight, Bell, Heart, Eye, MessageCircle, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllDomains, type ExpertDomain } from "@/lib/domainConfig";
import { useNavigate } from "react-router-dom";

const NotificationsSettingsPage = () => {
  const navigate = useNavigate();
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<Set<ExpertDomain>>(new Set());
  
  const [notifications, setNotifications] = useState({
    zoozReceived: true,
    trustReceived: true,
    watchReceived: true,
    commentReceived: true,
    trustedUserPublished: true,
    watchedUserPublished: true,
  });

  const allDomains = getAllDomains();

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDomainToggle = (domainId: ExpertDomain) => {
    setSelectedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
      } else {
        newSet.add(domainId);
      }
      return newSet;
    });
  };

  const notificationItems = [
    {
      key: 'zoozReceived' as const,
      icon: Heart,
      label: 'כשאני מקבל Zooz',
      description: 'התראה כשמישהו שולח לך Zooz'
    },
    {
      key: 'trustReceived' as const,
      icon: Users,
      label: 'כשמישהו נותן לי Trust',
      description: 'התראה כשמישהו מוסיף אותך לרשימת האמון'
    },
    {
      key: 'watchReceived' as const,
      icon: Eye,
      label: 'כשמישהו עוקב אחרי (Watch)',
      description: 'התראה כשמישהו מתחיל לעקוב אחריך'
    },
    {
      key: 'commentReceived' as const,
      icon: MessageCircle,
      label: 'כשמגיבים על הסרטון שלי',
      description: 'התראה על תגובות חדשות על הסרטונים שלך'
    },
    {
      key: 'trustedUserPublished' as const,
      icon: User,
      label: 'כשמישהו שאני נותן לו Trust מפרסם',
      description: 'התראה כשאנשים מרשימת האמון שלך מפרסמים תוכן'
    },
    {
      key: 'watchedUserPublished' as const,
      icon: Eye,
      label: 'כשמישהו שאני עוקב אחריו מפרסם',
      description: 'התראה כשאנשים שאתה עוקב אחריהם מפרסמים תוכן'
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">הגדרות התראות</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* WhatsApp Toggle */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5" />
              התראות WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  קבל התראות גם ב-WhatsApp בנוסף להתראות באפליקציה
                </p>
              </div>
              <Switch
                checked={whatsappEnabled}
                onCheckedChange={setWhatsappEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">התראות אישיות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-full bg-muted">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={() => handleNotificationToggle(item.key)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* General Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">התראות כלליות</CardTitle>
          </CardHeader>
          <CardContent>
            <Collapsible open={domainsOpen} onOpenChange={setDomainsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  size="lg"
                >
                  <div className="flex items-center gap-2">
                    {domainsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {selectedDomains.size > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedDomains.size} נבחרו
                      </Badge>
                    )}
                  </div>
                  <span className="font-medium">תחומים שברצוני לקבל התראות</span>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3 mt-4">
                <p className="text-sm text-muted-foreground">
                  בחר תחומים שתרצה לקבל התראות עליהם כשמישהו מפרסם בהם תוכן
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {allDomains.map((domain) => {
                    const IconComponent = domain.icon;
                    const isSelected = selectedDomains.has(domain.id);
                    
                    return (
                      <button
                        key={domain.id}
                        onClick={() => handleDomainToggle(domain.id)}
                        className={cn(
                          "p-3 rounded-lg border transition-all duration-200 text-right",
                          isSelected 
                            ? "border-primary bg-primary/10 shadow-sm" 
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            isSelected ? "bg-primary" : "bg-muted-foreground/30"
                          )} />
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{domain.hebrewName}</span>
                            <div className={cn(
                              "p-1.5 rounded-full",
                              isSelected ? domain.bgColor : "bg-muted"
                            )}>
                              <IconComponent className={cn(
                                "w-3 h-3",
                                isSelected ? domain.textColor : "text-muted-foreground"
                              )} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Summary */}
        {(Object.values(notifications).some(Boolean) || selectedDomains.size > 0) && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-medium text-sm mb-2">סיכום הגדרות</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  • התראות אישיות: {Object.values(notifications).filter(Boolean).length} מופעלות
                </p>
                <p>
                  • תחומים כלליים: {selectedDomains.size} נבחרו
                </p>
                <p>
                  • שיטת משלוח: אפליקציה{whatsappEnabled ? " + WhatsApp" : " בלבד"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationsSettingsPage;