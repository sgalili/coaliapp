import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Coins, Wallet, Users, ArrowLeft } from 'lucide-react';

interface OnboardingSuccessStepProps {
  onGiveTrust: () => void;
  onGoToWallet: () => void;
  isLoading?: boolean;
}

export const OnboardingSuccessStep: React.FC<OnboardingSuccessStepProps> = ({ 
  onGiveTrust, 
  onGoToWallet,
  isLoading = false 
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-scale-in">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            הפרופיל שלך הושלם בהצלחה!
          </h1>
          <p className="text-muted-foreground">
            ברוך הבא לקהילת Coali
          </p>
        </div>
      </div>

      {/* ZOOZ Reward Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-accent/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Coins className="w-8 h-8 text-yellow-500 animate-bounce" />
              <div>
                <div className="text-3xl font-bold text-primary animate-scale-in">
                  +10 ZOOZ
                </div>
                <div className="text-sm text-muted-foreground">
                  קיבלת בונוס השלמת פרופיל!
                </div>
              </div>
              <Coins className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            
            <div className="bg-background/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Wallet className="w-4 h-4" />
                <span>ניתן לראות אותם בארנק שלך בתפריט למטה</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onGoToWallet}
                className="w-full"
                disabled={isLoading}
              >
                <Wallet className="w-4 h-4 ml-2" />
                צפה בארנק
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Card */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                המשך לצבור ZOOZ!
              </h3>
              <p className="text-sm text-muted-foreground">
                תן אמון לחברים ומכרים שלך וקבל עוד ZOOZ עבור כל חבר שמצטרף
              </p>
            </div>

            {/* Incentive breakdown */}
            <div className="bg-accent/5 rounded-lg p-4 space-y-3">
              <div className="text-center">
                <div className="text-sm font-medium text-foreground mb-2">
                  איך לקבל עוד ZOOZ:
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">תן אמון לחבר</span>
                    <span className="font-semibold text-primary">+2 ZOOZ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">חבר מצטרף דרכך</span>
                    <span className="font-semibold text-primary">+5 ZOOZ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">חבר נותן לך אמון חזרה</span>
                    <span className="font-semibold text-primary">+3 ZOOZ</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={onGiveTrust}
              className="w-full py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              <Users className="w-5 h-5 ml-2" />
              תן אמון לחברים שלך וקבל עוד ZOOZ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};