import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Database, Shield, AlertTriangle, Info, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

interface DataPermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  critical: boolean;
  category: 'basic' | 'social' | 'financial' | 'behavioral';
}

export const DataManagementPage = () => {
  const navigate = useNavigate();
  const [showBVIMessage, setShowBVIMessage] = useState(true);
  
  useEffect(() => {
    document.documentElement.dir = 'rtl';
  }, []);

  const [permissions, setPermissions] = useState<DataPermission[]>([
    {
      id: 'basic_profile',
      name: 'פרופיל בסיסי',
      description: 'שם, אימייל, תמונת פרופיל',
      enabled: true,
      critical: true,
      category: 'basic'
    },
    {
      id: 'kyc_data',
      name: 'נתוני KYC',
      description: 'עיר, תאריך לידה, מספר זהות',
      enabled: true,
      critical: true,
      category: 'basic'
    },
    {
      id: 'phone_number',
      name: 'מספר טלפון',
      description: 'לאימות ובטיחות',
      enabled: true,
      critical: true,
      category: 'basic'
    },
    {
      id: 'location_data',
      name: 'נתוני מיקום',
      description: 'עיר מגורים ואזור גיאוגרפי',
      enabled: true,
      critical: false,
      category: 'basic'
    },
    {
      id: 'social_connections',
      name: 'קשרים חברתיים',
      description: 'רשימת אנשי קשר וחיבורים ברשת',
      enabled: true,
      critical: false,
      category: 'social'
    },
    {
      id: 'trust_relationships',
      name: 'יחסי אמון',
      description: 'מי אתה סומך עליו ומי סומך עליך',
      enabled: true,
      critical: true,
      category: 'social'
    },
    {
      id: 'expert_interactions',
      name: 'אינטראקציות עם מומחים',
      description: 'צפיות, שאלות ותגובות למומחים',
      enabled: true,
      critical: false,
      category: 'social'
    },
    {
      id: 'wallet_data',
      name: 'נתוני ארנק',
      description: 'יתרת ZOOZ והיסטוריית עסקאות',
      enabled: true,
      critical: true,
      category: 'financial'
    },
    {
      id: 'transaction_history',
      name: 'היסטוריית עסקאות',
      description: 'כל העברות ZOOZ שביצעת',
      enabled: true,
      critical: false,
      category: 'financial'
    },
    {
      id: 'earning_patterns',
      name: 'דפוסי הרווחה',
      description: 'איך אתה מרויח ZOOZ ברשת',
      enabled: false,
      critical: false,
      category: 'behavioral'
    },
    {
      id: 'usage_analytics',
      name: 'ניתוח שימוש',
      description: 'דפוסי ניווט ושימוש באפליקציה',
      enabled: false,
      critical: false,
      category: 'behavioral'
    },
    {
      id: 'content_preferences',
      name: 'העדפות תוכן',
      description: 'סוגי תוכן וחדשות שאתה צורך',
      enabled: true,
      critical: false,
      category: 'behavioral'
    }
  ]);

  const togglePermission = (id: string) => {
    setPermissions(prev => prev.map(perm => 
      perm.id === id ? { ...perm, enabled: !perm.enabled } : perm
    ));
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'basic': return 'נתונים בסיסיים';
      case 'social': return 'נתונים חברתיים';
      case 'financial': return 'נתונים פיננסיים';
      case 'behavioral': return 'נתוני התנהגות';
      default: return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic': return Shield;
      case 'social': return ArrowRight;
      case 'financial': return Database;
      case 'behavioral': return Info;
      default: return Info;
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, DataPermission[]>);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Close Button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
            onClick={() => navigate("/profile")}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold">הנתונים שלי</h1>
          <p className="text-sm text-muted-foreground mt-1">
            בחר אילו נתונים Coali רשאית לשמור ולעבד
          </p>
        </div>

        {/* Luxurious BVI Message */}
        {showBVIMessage && (
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <CardContent className="relative p-6">
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-3 top-3 h-auto p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => setShowBVIMessage(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">העתיד כאן - VBI Blockchain</h3>
                </div>
                
                <p className="text-white/90 text-sm leading-relaxed">
                  <strong className="text-yellow-300">עדכון מהפכני:</strong> בקרוב נעבור למערכת בלוקצ'יין מתקדמת המבוססת על 
                  <strong className="text-yellow-300"> VBI (Verifier Blockchain Identity)</strong> - 
                  שליטה מוחלטת בזהות הדיגיטלית שלך, אנונימיות מלאה ושקיפות מוחלטת.
                </p>
                
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-xs text-white/90">
                    הפלטפורמה היחידה עם טכנולוגיית VBI לאימות זהות מבוזר
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warning Alert */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            שינוי הגדרות נתונים קריטיים עלול להשפיע על תפקוד האפליקציה
          </AlertDescription>
        </Alert>

        {/* Data Categories */}
        {Object.entries(groupedPermissions).map(([category, perms]) => {
          const CategoryIcon = getCategoryIcon(category);
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{getCategoryTitle(category)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {perms.map((permission) => (
                  <div key={permission.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{permission.name}</h4>
                          {permission.critical && (
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                      <div className="flex items-center">
                        <Switch
                          checked={permission.enabled}
                          onCheckedChange={() => togglePermission(permission.id)}
                          disabled={permission.critical}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </div>
                    
                    {permission.critical && !permission.enabled && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800 text-xs">
                          נתון זה נדרש לתפקוד תקין של האפליקציה
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-sm">סיכום הגדרות</h3>
              <p className="text-xs text-muted-foreground">
                {permissions.filter(p => p.enabled).length} מתוך {permissions.length} סוגי נתונים מאושרים
              </p>
              <Button className="w-full h-9 text-sm">
                שמור הגדרות
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default DataManagementPage;