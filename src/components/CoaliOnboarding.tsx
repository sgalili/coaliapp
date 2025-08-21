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
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          {/* Background blur effect with fake content */}
          <div className="absolute inset-0">
            {/* Animated fake video thumbnails */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 0.3, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute top-16 left-4 w-20 h-16 bg-gradient-to-br from-red-500/40 to-orange-500/40 rounded blur-sm transform -rotate-12"
            >
              <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                <span className="text-xs text-white/60">FAKE</span>
              </div>
            </motion.div>
            
            {/* Floating fake profile */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 0.2, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute top-1/3 right-6 w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-sm transform rotate-6"
            >
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                <span className="text-xs text-white/60">AI</span>
              </div>
            </motion.div>
            
            {/* Deepfake indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.25, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-1/3 left-8 w-24 h-6 bg-gradient-to-r from-destructive/30 to-red-600/30 rounded blur-sm transform -rotate-6"
            >
              <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                <span className="text-xs text-white/60">DEEPFAKE</span>
              </div>
            </motion.div>
            
            {/* Matrix-like blur overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-background/20 to-muted/30 backdrop-blur-[2px]"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative z-10"
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <div className="relative">
                <Eye className="w-20 h-20 mx-auto text-destructive drop-shadow-lg" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute inset-0 border-2 border-destructive/30 rounded-full animate-pulse"
                />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-3xl font-bold mb-8 text-destructive drop-shadow-sm"
            >
              {t('onboarding.screen1.title')}
            </motion.h1>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="text-lg text-foreground font-medium"
              >
                {t('onboarding.screen1.line1')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="text-lg text-muted-foreground"
              >
                {t('onboarding.screen1.line2')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.6 }}
                className="text-lg text-destructive font-semibold"
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
          {/* Trust building elements in background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Trust connections */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                className="absolute w-2 h-2 bg-trust rounded-full"
                style={{
                  left: `${20 + (i % 3) * 30}%`,
                  top: `${20 + Math.floor(i / 3) * 40}%`,
                }}
              />
            ))}
            
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.1 }}
                transition={{ delay: 1.5, duration: 1 }}
                x1="20%" y1="20%" x2="50%" y2="60%"
                stroke="hsl(var(--trust))" strokeWidth="1" strokeDasharray="2,2"
              />
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.1 }}
                transition={{ delay: 1.8, duration: 1 }}
                x1="50%" y1="20%" x2="80%" y2="60%"
                stroke="hsl(var(--trust))" strokeWidth="1" strokeDasharray="2,2"
              />
            </svg>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, type: "spring", stiffness: 100 }}
            className="mb-8 relative z-10"
          >
            {/* Animated TrustRank that grows */}
            <div className="relative">
              <motion.div
                className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-trust via-primary to-trust flex items-center justify-center shadow-lg"
                initial={{ scale: 0.5, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 0.5, duration: 1, type: "spring" }}
              >
                <TrendingUp className="w-16 h-16 text-trust-foreground" />
              </motion.div>
              
              {/* Trust score that counts up */}
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6, type: "spring" }}
                className="absolute -top-3 -right-3 bg-trust text-trust-foreground text-lg font-bold px-3 py-2 rounded-full shadow-lg border-4 border-background"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    95%
                  </motion.div>
                </motion.span>
              </motion.div>
              
              {/* Pulsing rings */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.3, 0.8], opacity: [0, 0.3, 0] }}
                transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-trust rounded-full"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.5, 0.8], opacity: [0, 0.2, 0] }}
                transition={{ delay: 1.8, duration: 2, repeat: Infinity }}
                className="absolute inset-0 border border-primary rounded-full"
              />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-2xl font-bold mb-6 bg-gradient-to-r from-trust to-primary bg-clip-text text-transparent"
          >
            {t('onboarding.screen2.title')}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="space-y-4 max-w-sm mx-auto"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-lg text-foreground leading-relaxed"
            >
              {t('onboarding.screen2.line1')}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="text-xl font-bold bg-gradient-to-r from-trust to-primary bg-clip-text text-transparent"
            >
              {t('onboarding.screen2.line2')}
            </motion.p>
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
          {/* Animated trusted profiles by domain */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            {/* Profile avatars with domain labels */}
            <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto mb-8">
              {/* Tech Expert */}
              <motion.div
                initial={{ y: 30, opacity: 0, rotateY: -90 }}
                animate={{ y: 0, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="text-2xl"
                    >
                      💻
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.4 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-trust rounded-full flex items-center justify-center text-xs font-bold text-trust-foreground"
                  >
                    98
                  </motion.div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">Tech</span>
              </motion.div>
              
              {/* Finance Expert */}
              <motion.div
                initial={{ y: 30, opacity: 0, rotateY: -90 }}
                animate={{ y: 0, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="text-2xl"
                    >
                      📈
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-trust rounded-full flex items-center justify-center text-xs font-bold text-trust-foreground"
                  >
                    96
                  </motion.div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">Finance</span>
              </motion.div>
              
              {/* Health Expert */}
              <motion.div
                initial={{ y: 30, opacity: 0, rotateY: -90 }}
                animate={{ y: 0, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                      className="text-2xl"
                    >
                      🏥
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4, duration: 0.4 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-trust rounded-full flex items-center justify-center text-xs font-bold text-trust-foreground"
                  >
                    97
                  </motion.div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">Santé</span>
              </motion.div>
            </div>
            
            {/* Trust network visualization */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="relative h-8 mb-6"
            >
              <svg className="w-full h-full">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.8, duration: 1.5 }}
                  d="M 20 16 Q 160 4 300 16"
                  stroke="hsl(var(--trust))"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                  strokeDasharray="4,2"
                />
              </svg>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="space-y-4 mb-8"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-lg font-semibold text-muted-foreground"
            >
              {t('onboarding.screen4.line1')}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="text-xl font-bold text-primary"
            >
              {t('onboarding.screen4.line2')}
            </motion.p>
          </motion.div>
          
          {/* Real-time counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mb-8 p-4 bg-gradient-to-r from-primary/10 to-trust/10 rounded-lg border border-primary/20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.05, 1] }}
              transition={{ delay: 2.2, duration: 0.8 }}
            >
              <p className="text-sm text-muted-foreground">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.4 }}
                  className="block font-bold text-lg text-primary mb-1"
                >
                  {t('onboarding.screen4.counter')}
                </motion.span>
                {t('onboarding.screen4.counterText')}
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-primary via-trust to-primary text-primary-foreground font-bold py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-trust/20"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.4 }}
                >
                  💥 {t('onboarding.screen4.cta')}
                </motion.span>
              </Button>
            </motion.div>
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