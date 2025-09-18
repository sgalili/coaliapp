import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Vote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoteAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
  candidate: string;
  position: string;
}

export const VoteAnimation = ({
  isOpen,
  onClose,
  onConfirm,
  username,
  candidate,
  position
}: VoteAnimationProps) => {
  const [phase, setPhase] = useState<'confirmation' | 'celebration'>('confirmation');
  const [confettiVisible, setConfettiVisible] = useState(false);

  const handleConfirm = () => {
    setPhase('celebration');
    setConfettiVisible(true);
    onConfirm();
    
    // Auto-close after celebration
    setTimeout(() => {
      onClose();
      setPhase('confirmation');
      setConfettiVisible(false);
    }, 3000);
  };

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <AnimatePresence mode="wait">
            {phase === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -50 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-card border border-border rounded-2xl p-8 w-full max-w-md mx-auto relative shadow-2xl"
              >
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-4 right-4 hover:bg-secondary rounded-full p-2"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Ballot Box */}
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 15 }}
                      className="w-24 h-20 bg-gradient-to-b from-muted-foreground/20 to-muted-foreground/40 border-2 border-muted-foreground/60 rounded-lg relative overflow-hidden shadow-lg"
                    >
                      {/* Ballot slot */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-background/80 rounded-full shadow-inner border border-muted-foreground/30" />
                      {/* Vote icon */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                        <Vote className="w-6 h-6 text-primary" />
                      </div>
                      {/* Lock mechanism */}
                      <div className="absolute top-0 right-1 w-2 h-2 bg-muted-foreground/60 rounded-full" />
                    </motion.div>
                  </div>

                  {/* Hand with Ballot */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", damping: 20 }}
                    className="relative"
                  >
                    {/* Hand */}
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 2, 0, -2, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-6xl transform -rotate-12"
                    >
                      ✋
                    </motion.div>
                    
                    {/* Ballot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="absolute -top-4 -right-2 bg-background border border-border rounded-sm p-2 shadow-lg min-w-32 max-w-40"
                    >
                      <div className="text-xs font-semibold text-foreground text-center">
                        <div className="text-primary">{username}</div>
                        <div className="text-muted-foreground mt-1 leading-tight">
                          {candidate} – {position}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Confirmation text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      אישור הצבעה
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      האם אתה בטוח שברצונך להצביע עבור {candidate} לתפקיד {position}?
                    </p>
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex gap-3 w-full"
                  >
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 text-foreground hover:bg-secondary"
                    >
                      ביטול
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="flex-1 bg-vote hover:bg-vote/90 text-vote-foreground font-semibold shadow-lg"
                    >
                      הצבע כעת
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {phase === 'celebration' && (
              <motion.div
                key="celebration"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="flex flex-col items-center space-y-6"
              >
                {/* Animated Ballot Box - Closing */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="relative"
                >
                  <motion.div
                    className="w-32 h-24 bg-gradient-to-b from-muted-foreground/20 to-muted-foreground/40 border-2 border-muted-foreground/60 rounded-lg relative overflow-hidden shadow-2xl"
                  >
                    {/* Closing lid animation */}
                    <motion.div
                      initial={{ rotateX: 0 }}
                      animate={{ rotateX: -15 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-muted-foreground/40 to-muted-foreground/60 rounded-t-lg shadow-inner border-b border-muted-foreground/30"
                      style={{ transformOrigin: 'bottom' }}
                    />
                    
                    {/* Vote icon with glow */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2"
                    >
                      <Vote className="w-8 h-8 text-primary drop-shadow-lg" />
                    </motion.div>

                    {/* Success checkmark */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2, type: "spring", damping: 10 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.4, type: "spring" }}
                        className="text-white text-lg font-bold"
                      >
                        ✓
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Success message */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, type: "spring", damping: 20 }}
                  className="text-center space-y-2"
                >
                  <h2 className="text-2xl font-bold text-green-400">
                    ברavo!
                  </h2>
                  <p className="text-lg text-foreground">
                    הקול שלך נספר ✅
                  </p>
                  <p className="text-sm text-muted-foreground">
                    תודה על השתתפותך בדמוקרטיה
                  </p>
                </motion.div>

                {/* Confetti */}
                {confettiVisible && (
                  <div className="fixed inset-0 pointer-events-none">
                    {confettiParticles.map((particle) => (
                      <motion.div
                        key={particle.id}
                        initial={{
                          x: `${particle.x}vw`,
                          y: `-10vh`,
                          rotate: 0,
                          opacity: 1
                        }}
                        animate={{
                          y: `110vh`,
                          rotate: 360,
                          opacity: [1, 1, 0.5, 0]
                        }}
                        transition={{
                          duration: 3,
                          delay: particle.delay,
                          ease: "easeIn"
                        }}
                        className="absolute w-2 h-2 rounded-sm"
                        style={{ backgroundColor: particle.color }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};