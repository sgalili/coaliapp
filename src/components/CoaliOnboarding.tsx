import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Eye, Zap, Users, Crown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { SwipeableCard } from "@/components/SwipeableCard";

interface CoaliOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CoaliOnboarding = ({ isOpen, onClose, onComplete }: CoaliOnboardingProps) => {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 4;

  const nextScreen = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const prevScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSwipeLeft = () => {
    nextScreen();
  };

  const handleSwipeRight = () => {
    prevScreen();
  };

  const screens = [
    // Screen 1: Le monde est devenu fake
    {
      id: 'fake-world',
      component: (
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          {/* Background blur effect with fake content */}
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 via-muted/40 to-destructive/10 backdrop-blur-sm">
            <div className="absolute top-1/4 left-4 opacity-30 text-xs text-muted-foreground bg-card/60 p-2 rounded transform -rotate-12">
              {t('onboarding.screen1.fakeNews')}
            </div>
            <div className="absolute top-1/3 right-6 opacity-25 text-xs text-muted-foreground bg-card/60 p-2 rounded transform rotate-6">
              {t('onboarding.screen1.aiGenerated')}
            </div>
            <div className="absolute bottom-1/3 left-8 opacity-20 text-xs text-muted-foreground bg-card/60 p-2 rounded transform -rotate-6">
              {t('onboarding.screen1.deepfake')}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative z-10"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
              className="mb-8"
            >
              <Eye className="w-16 h-16 mx-auto text-destructive" />
            </motion.div>
            
            <h1 className="text-2xl font-bold mb-6 text-foreground">
              {t('onboarding.screen1.title')}
            </h1>
            
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {t('onboarding.screen1.line1')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {t('onboarding.screen1.line2')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                {t('onboarding.screen1.line3')}
              </motion.p>
            </div>
          </motion.div>
        </div>
      )
    },
    // Screen 2: Coali remet la confiance au centre
    {
      id: 'trust-center',
      component: (
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            {/* Animated TrustRank */}
            <div className="relative">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-trust to-primary flex items-center justify-center"
              >
                <TrendingUp className="w-12 h-12 text-trust-foreground" />
              </motion.div>
              
              {/* Trust score animation */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -top-2 -right-2 bg-trust text-trust-foreground text-xs font-bold px-2 py-1 rounded-full"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  95%
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl font-bold mb-6 bg-gradient-to-r from-trust to-primary bg-clip-text text-transparent"
          >
            {t('onboarding.screen2.title')}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3 text-muted-foreground leading-relaxed"
          >
            <p>{t('onboarding.screen2.line1')}</p>
            <p className="font-semibold text-foreground">{t('onboarding.screen2.line2')}</p>
          </motion.div>
        </div>
      )
    },
    // Screen 3: Ce que tu gagnes avec le Trust
    {
      id: 'trust-benefits',
      component: (
        <div className="relative h-full flex flex-col justify-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-8 text-center text-foreground"
          >
            {t('onboarding.screen3.title')}
          </motion.h1>
          
          <div className="space-y-6">
            {/* Benefit 1 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-foreground flex-1 leading-relaxed">
                {t('onboarding.screen3.benefit1')}
              </p>
            </motion.div>
            
            {/* Benefit 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-zooz rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-zooz-foreground" />
              </div>
              <p className="text-foreground flex-1 leading-relaxed">
                {t('onboarding.screen3.benefit2')}
              </p>
            </motion.div>
            
            {/* Benefit 3 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-trust rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-trust-foreground" />
              </div>
              <p className="text-foreground flex-1 leading-relaxed">
                {t('onboarding.screen3.benefit3')}
              </p>
            </motion.div>
            
            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-6 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-trust/10 border border-primary/20"
            >
              <p className="text-sm text-center text-muted-foreground">
                <Crown className="w-4 h-4 inline mr-2" />
                {t('onboarding.screen3.comingSoon')}
              </p>
            </motion.div>
          </div>
        </div>
      )
    },
    // Screen 4: Rejoins les plus trusted
    {
      id: 'join-trusted',
      component: (
        <div className="relative h-full flex flex-col justify-center px-6 text-center">
          {/* Animated trusted profiles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex justify-center items-center gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                  className="relative"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-trust to-primary rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-trust-foreground" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-zooz rounded-full flex items-center justify-center text-xs font-bold text-zooz-foreground"
                  >
                    {95 + i}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4 mb-8"
          >
            <p className="text-lg font-semibold text-foreground">
              {t('onboarding.screen4.line1')}
            </p>
            <p className="text-xl font-bold text-primary">
              {t('onboarding.screen4.line2')}
            </p>
          </motion.div>
          
          {/* Stats counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-8 p-4 bg-card/50 rounded-lg border border-border/50"
          >
            <p className="text-sm text-muted-foreground">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="font-bold text-primary"
              >
                {t('onboarding.screen4.counter')}
              </motion.span>
              <br />
              {t('onboarding.screen4.counterText')}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-primary to-trust text-primary-foreground font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              💥 {t('onboarding.screen4.cta')}
            </Button>
          </motion.div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Header with close button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-card/80 backdrop-blur-sm border border-border/50"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Back button for screens > 0 */}
        {currentScreen > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevScreen}
              className="rounded-full bg-card/80 backdrop-blur-sm border border-border/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        )}
        
        {/* Main content with swipe support */}
        <div className="h-full w-full overflow-hidden">
          <SwipeableCard
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            className="h-full w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full w-full"
              >
                {screens[currentScreen].component}
              </motion.div>
            </AnimatePresence>
          </SwipeableCard>
        </div>
        
        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: totalScreens }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentScreen ? 1.2 : 1,
                backgroundColor: index === currentScreen ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
              }}
              transition={{ duration: 0.2 }}
              className="w-2 h-2 rounded-full cursor-pointer"
              onClick={() => setCurrentScreen(index)}
            />
          ))}
        </div>
        
        {/* Skip/Next button */}
        <div className="absolute bottom-8 right-6 z-10">
          <Button
            variant="ghost"
            onClick={nextScreen}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            {currentScreen === totalScreens - 1 ? (
              t('onboarding.complete')
            ) : (
              <>
                {t('onboarding.next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};