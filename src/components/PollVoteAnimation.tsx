import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Coins } from 'lucide-react';

interface PollVoteAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedOption: string;
  pollQuestion: string;
}

export const PollVoteAnimation = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedOption, 
  pollQuestion 
}: PollVoteAnimationProps) => {
  const [phase, setPhase] = useState<'confirmation' | 'celebration'>('confirmation');
  const [confettiVisible, setConfettiVisible] = useState(false);

  const handleConfirm = () => {
    setPhase('celebration');
    setConfettiVisible(true);
    onConfirm();
    
    setTimeout(() => {
      onClose();
      setPhase('confirmation');
      setConfettiVisible(false);
    }, 1800);
  };

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
  }));

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto relative overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 left-4 p-2 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <AnimatePresence mode="wait">
              {phase === 'confirmation' && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center"
                >
                  {/* Ballot box animation */}
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <motion.div
                      className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg"
                      animate={{ 
                        rotateY: [0, 5, -5, 0],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-700 rounded-full"></div>
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-blue-700 rounded-sm"></div>
                    </motion.div>
                    
                    {/* Floating ballot */}
                    <motion.div
                      className="absolute -top-2 right-2 w-6 h-8 bg-white rounded-sm shadow-md border"
                      animate={{ 
                        y: [-5, -10, -5],
                        rotate: [5, 10, 5]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="w-full h-1 bg-blue-300 rounded mt-1"></div>
                      <div className="w-3/4 h-0.5 bg-gray-300 rounded mt-1 mx-auto"></div>
                      <div className="w-1/2 h-0.5 bg-gray-300 rounded mt-1 mx-auto"></div>
                    </motion.div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    אישור הצבעה
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {pollQuestion}
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <div className="text-sm text-blue-800 font-medium">
                      הבחירה שלך:
                    </div>
                    <div className="text-lg font-bold text-blue-900 mt-1">
                      {selectedOption}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300"
                      onClick={onClose}
                    >
                      ביטול
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      onClick={handleConfirm}
                    >
                      אישור הצבעה
                    </Button>
                  </div>
                </motion.div>
              )}

              {phase === 'celebration' && (
                <motion.div
                  key="celebration"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  {/* Animated ballot box with closing lid */}
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <motion.div
                      className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotateY: [0, 360]
                      }}
                      transition={{ 
                        duration: 1,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div 
                        className="absolute top-0 left-0 w-full h-3 bg-emerald-700 rounded-t-lg origin-top"
                        animate={{ rotateX: [0, -90] }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      ></motion.div>
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-emerald-700 rounded-sm"></div>
                    </motion.div>
                    
                    {/* Success checkmark */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", damping: 15 }}
                    >
                      <motion.div
                        className="w-3 h-3 border-2 border-emerald-600 rounded-full"
                        animate={{ 
                          background: ["transparent", "#10b981"],
                          borderColor: ["#10b981", "#ffffff"]
                        }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                      >
                        <motion.div
                          className="w-1.5 h-0.5 bg-white rotate-45 translate-x-0.5 translate-y-1"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.8, duration: 0.2 }}
                        ></motion.div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* ZOOZ celebration */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <motion.div
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 0.6,
                          repeat: 2,
                          delay: 0.5
                        }}
                      >
                        <Coins className="h-6 w-6 text-yellow-500" />
                      </motion.div>
                      <span className="text-xl font-bold text-emerald-600">
                        מזל טוב!
                      </span>
                    </div>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: 0.8, 
                        type: "spring", 
                        damping: 10, 
                        stiffness: 200 
                      }}
                      className="bg-gradient-to-r from-yellow-50 to-emerald-50 border border-yellow-200 rounded-lg p-3"
                    >
                      <div className="text-lg font-bold text-emerald-700">
                        זכית ב-1 ZOOZ!
                      </div>
                      <div className="text-sm text-emerald-600">
                        ההצבעה שלך נרשמה בהצלחה
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Confetti animation */}
                  {confettiVisible && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {confettiParticles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          className="absolute w-2 h-2 rounded-full"
                          style={{ 
                            backgroundColor: particle.color,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                          }}
                          animate={{
                            y: [0, -30, 100],
                            opacity: [1, 1, 0],
                            rotate: [0, 180, 360],
                            scale: [1, 0.8, 0.6]
                          }}
                          transition={{
                            duration: 2,
                            delay: particle.delay,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};