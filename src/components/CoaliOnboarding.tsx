import { X, Shield, Eye, TrendingUp, Zap, Users, Crown, Wallet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

interface CoaliOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CoaliOnboarding = ({ isOpen, onClose, onComplete }: CoaliOnboardingProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl h-[90vh] bg-background rounded-2xl shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-trust via-primary to-trust rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-trust-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Découvrir Coali</h1>
              <p className="text-sm text-muted-foreground">Le Premier Réseau de Confiance</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="h-[calc(100%-140px)]">
          <div className="p-6 space-y-8">
            {/* Section 1: Le monde est devenu fake */}
            <section className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-destructive">{t('auth.onboarding.screen1.title')}</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>{t('auth.onboarding.screen1.line1')}</p>
                <p>{t('auth.onboarding.screen1.line2')}</p>
                <p className="font-semibold text-destructive">{t('auth.onboarding.screen1.line3')}</p>
              </div>
            </section>

            {/* Section 2: Coali remet la confiance au centre */}
            <section className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-trust via-primary to-trust rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-10 h-10 text-trust-foreground" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-trust to-primary bg-clip-text text-transparent mb-2">
                  {t('auth.onboarding.screen2.title')}
                </h2>
                <p className="text-sm font-semibold text-trust">{t('auth.onboarding.screen2.subtitle')}</p>
              </div>
              
              <div className="grid gap-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-foreground">{t('auth.onboarding.screen2.line1')}</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-foreground">{t('auth.onboarding.screen2.line2')}</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-foreground">{t('auth.onboarding.screen2.line3')}</p>
                </div>
                <div className="p-4 bg-trust/10 border border-trust/20 rounded-lg">
                  <p className="text-trust font-semibold">{t('auth.onboarding.screen2.line4')}</p>
                </div>
              </div>
            </section>

            {/* Section 3: Ce que tu gagnes concrètement */}
            <section className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('auth.onboarding.screen3.title')}</h2>
                <p className="text-sm font-semibold text-zooz">{t('auth.onboarding.screen3.subtitle')}</p>
              </div>

              {/* ZOOZ Rewards */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-zooz flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {t('auth.onboarding.screen3.zoozRewards.title')}
                </h3>
                <div className="grid gap-2 pl-7">
                  <div className="p-3 bg-zooz/10 border border-zooz/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.zoozRewards.comment')}</p>
                  </div>
                  <div className="p-3 bg-zooz/10 border border-zooz/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.zoozRewards.prediction')}</p>
                  </div>
                  <div className="p-3 bg-zooz/10 border border-zooz/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.zoozRewards.referral')}</p>
                  </div>
                </div>
              </div>

              {/* Affiliation Program */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t('auth.onboarding.screen3.affiliation.title')}
                </h3>
                <div className="grid gap-2 pl-7">
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.affiliation.line1')}</p>
                  </div>
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.affiliation.line2')}</p>
                  </div>
                </div>
              </div>

              {/* Expert News */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-trust flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {t('auth.onboarding.screen3.newsExpert.title')}
                </h3>
                <div className="grid gap-2 pl-7">
                  <div className="p-3 bg-trust/10 border border-trust/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.newsExpert.line1')}</p>
                  </div>
                  <div className="p-3 bg-trust/10 border border-trust/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.newsExpert.line2')}</p>
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  {t('auth.onboarding.screen3.wallet.title')}
                </h3>
                <div className="grid gap-2 pl-7">
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.wallet.line1')}</p>
                  </div>
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen3.wallet.line2')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Contenus 100% Authentiques */}
            <section className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('auth.onboarding.screen4.title')}</h2>
                <p className="text-sm font-semibold text-primary">{t('auth.onboarding.screen4.subtitle')}</p>
              </div>

              {/* Authentic Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t('auth.onboarding.screen4.authentic.title')}
                </h3>
                <div className="grid gap-2 pl-7">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-900/30">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen4.authentic.line1')}</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-900/30">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen4.authentic.line2')}</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-900/30">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen4.authentic.line3')}</p>
                  </div>
                </div>
              </div>

              {/* Most Trusted Rankings */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-amber-600 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  {t('auth.onboarding.screen4.rankings.title')}
                </h3>
                <div className="grid gap-2 pl-7">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-900/30">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen4.rankings.line1')}</p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-900/30">
                    <p className="text-sm text-foreground">{t('auth.onboarding.screen4.rankings.line2')}</p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center space-y-4 pt-4">
                <div className="p-4 bg-gradient-to-r from-trust/10 to-primary/10 rounded-lg border border-trust/20">
                  <p className="text-2xl font-bold text-trust mb-1">{t('auth.onboarding.screen4.cta.counter')}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {t('auth.onboarding.screen4.cta.counterText')}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Footer CTA */}
        <div className="p-6 border-t border-border">
          <Button 
            onClick={onComplete} 
            className="w-full bg-gradient-to-r from-trust to-primary hover:from-trust/90 hover:to-primary/90 text-trust-foreground font-semibold"
            size="lg"
          >
            {t('auth.onboarding.screen4.cta.button')}
          </Button>
        </div>
      </div>
    </div>
  );
};