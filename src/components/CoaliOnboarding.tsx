import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, TrendingUp, Users, Zap, Trophy, Eye, Video, Coins } from 'lucide-react';

interface CoaliOnboardingProps {
  onClose: () => void;
  onGetStarted: () => void;
}

export const CoaliOnboarding: React.FC<CoaliOnboardingProps> = ({ onClose, onGetStarted }) => {
  const { t } = useTranslation();
  const [userCount, setUserCount] = useState(35412);

  // Simulate real-time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background" dir="rtl">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 hover:bg-accent"
      >
        <X className="h-5 w-5" />
      </Button>

      <ScrollArea className="h-full">
        <div className="min-h-screen">
          
          {/* Step 1: Le monde est devenu fake */}
          <section className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Background with blur effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-muted/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--destructive)/0.1),transparent)] blur-3xl" />
            
            <div className="relative z-10 text-center space-y-8 max-w-sm">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-destructive to-destructive/60 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-foreground">
                  {t('onboarding.step1.title')}
                </h1>
                <p className="text-xl font-semibold text-muted-foreground">
                  {t('onboarding.step1.subtitle')}
                </p>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-line">
                  {t('onboarding.step1.description')}
                </p>
              </div>
            </div>
          </section>

          {/* Step 2: Coali remet la confiance au centre */}
          <section className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Background with trust gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-trust/20 to-primary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--trust)/0.2),transparent)] blur-2xl" />
            
            <div className="relative z-10 text-center space-y-8 max-w-sm">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-trust to-primary rounded-full flex items-center justify-center mx-auto shadow-xl animate-gentle-pulse">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-trust to-primary bg-clip-text text-transparent">
                  {t('onboarding.step2.title')}
                </h1>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-line">
                  {t('onboarding.step2.description')}
                </p>
                
                {/* Trust Graph Simulation */}
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-trust/20">
                  <div className="flex items-end justify-between h-16 gap-2">
                    {[40, 60, 45, 80, 95, 75, 90].map((height, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-trust to-trust/60 rounded-t flex-1 animate-fade-in"
                        style={{ 
                          height: `${height}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-trust font-semibold mt-2 text-center">TrustRank ↗</p>
                </div>
              </div>
            </div>
          </section>

          {/* Step 3: Ce que tu gagnes avec le Trust */}
          <section className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Background with zooz gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-zooz/20 to-watch/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--zooz)/0.15),transparent)] blur-2xl" />
            
            <div className="relative z-10 space-y-8 max-w-sm w-full">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-zooz to-watch rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Zap className="w-10 h-10 text-zooz-foreground" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-zooz to-watch bg-clip-text text-transparent">
                  {t('onboarding.step3.title')}
                </h1>
              </div>
              
              <div className="space-y-4">
                {/* Benefit 1 */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-watch/20 hover:border-watch/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <Video className="w-6 h-6 text-watch shrink-0" />
                    <p className="text-sm font-medium text-foreground">{t('onboarding.step3.benefit1')}</p>
                  </div>
                </div>
                
                {/* Benefit 2 */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-zooz/20 hover:border-zooz/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <Coins className="w-6 h-6 text-zooz shrink-0" />
                    <p className="text-sm font-medium text-foreground">{t('onboarding.step3.benefit2')}</p>
                  </div>
                </div>
                
                {/* Benefit 3 */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-trust/20 hover:border-trust/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-trust shrink-0" />
                    <p className="text-sm font-medium text-foreground">{t('onboarding.step3.benefit3')}</p>
                  </div>
                </div>
                
                {/* Future */}
                <div className="bg-gradient-to-r from-primary/10 to-trust/10 rounded-2xl p-4 border border-primary/30">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-primary shrink-0" />
                    <p className="text-sm font-medium text-foreground">{t('onboarding.step3.future')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 4: Rejoins les plus trusted */}
          <section className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Background with golden gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-trust/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,hsl(var(--primary)/0.15),transparent)] blur-2xl" />
            
            <div className="relative z-10 space-y-8 max-w-sm w-full">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-trust rounded-full flex items-center justify-center mx-auto shadow-xl animate-primary-glow">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-trust bg-clip-text text-transparent">
                  {t('onboarding.step4.title')}
                </h1>
              </div>

              {/* Mock Most Trusted Section */}
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-primary/20">
                <div className="space-y-3">
                  <div className="text-xs text-primary font-semibold uppercase tracking-wide">Most Trusted - Tech</div>
                  {['Dr. Sarah Cohen', 'Michael Tech', 'Alex Innovation'].map((name, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-trust to-primary" />
                        <span className="text-sm font-medium">{name}</span>
                      </div>
                      <span className="text-xs text-trust">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center space-y-6">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-line font-medium">
                  {t('onboarding.step4.description')}
                </p>
                
                {/* Counter */}
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{userCount.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {t('onboarding.step4.counter')}
                  </p>
                </div>
                
                {/* CTA Button */}
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-primary to-trust hover:from-primary/90 hover:to-trust/90 text-white shadow-lg"
                >
                  💥 {t('onboarding.step4.cta')}
                </Button>
              </div>
            </div>
          </section>

        </div>
      </ScrollArea>
    </div>
  );
};