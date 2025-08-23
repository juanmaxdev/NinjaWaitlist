'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRiddleSubmit } from '../../hooks/riddles';

interface NinjaSecretMenuProps {
  isVisible: boolean;
  collectedLetters: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  onVisibilityChange: (visible: boolean) => void;
  onSecretFound?: (word: string) => void;
}

export default function NinjaSecretMenu({
  isVisible,
  collectedLetters,
  onVisibilityChange,
  onSecretFound,
}: NinjaSecretMenuProps) {
  const [isCorrectWord, setIsCorrectWord] = useState<boolean | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [verificationCountdown, setVerificationCountdown] = useState<number | null>(null);
  const [progressBarKey, setProgressBarKey] = useState(0);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const verificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const unitOrder: (keyof typeof collectedLetters)[] = ['days', 'hours', 'minutes', 'seconds'];

  const { checkRiddle } = useRiddleSubmit();
  const [secretWord, setSecretWord] = useState<string | null>(null);

  const resetHideTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    setProgressBarKey((prev) => prev + 1);

    hideTimeoutRef.current = setTimeout(() => {
      onVisibilityChange(false);
    }, 10000);
  };

  const startVerificationCountdown = () => {
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    setVerificationCountdown(3);

    countdownIntervalRef.current = setInterval(() => {
      setVerificationCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    verificationTimeoutRef.current = setTimeout(() => {
      checkWord();
      setVerificationCountdown(null);
    }, 3000);
  };

  const checkWord = async () => {
    const letters = unitOrder.map((key) => collectedLetters[key]);
    const answerString = letters.join('');
    const secretWordRiddle = 'ニンジャ';

    setIsShaking(false);
    setSecretWord(null);

    try {
      if (answerString === secretWordRiddle) {
        setIsCorrectWord(true);
        setSecretWord(secretWordRiddle);
        onSecretFound?.(secretWordRiddle);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      } else {
        setIsCorrectWord(false);
        setIsShaking(true);

        setTimeout(() => {
          setIsCorrectWord(null);
          setIsShaking(false);
          resetHideTimer();
        }, 1500);
      }
    } catch (err: any) {
      setIsCorrectWord(false);
      setIsShaking(true);

      setTimeout(() => {
        setIsCorrectWord(null);
        setIsShaking(false);
        resetHideTimer();
      }, 1500);
    }
  };

  useEffect(() => {
    const allLettersFilled = Object.values(collectedLetters).every((letter) => letter !== '');

    if (allLettersFilled && isVisible) {
      startVerificationCountdown();
    } else {
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      setVerificationCountdown(null);

      if (isVisible && isCorrectWord !== true) {
        resetHideTimer();
      }
    }
  }, [collectedLetters, isVisible]);

  useEffect(() => {
    if (isVisible && isCorrectWord !== true) {
      resetHideTimer();
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration: 0.6,
          }}
          className="mt-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 via-gray-600/30 to-gray-800/20 rounded-2xl blur-xl animate-pulse"></div>

          <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white sm:text-sm lg:text-xl font-semibold mb-4 text-center font-ninja">
              Los que guardan la hora en la palma de la sombra no piden permiso al amanecer
            </h3>

            <motion.div
              className="flex justify-center gap-2"
              animate={
                isShaking
                  ? {
                      x: [-10, 10, -10, 10, 0],
                      rotate: [-2, 2, -2, 2, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              {unitOrder.map((key, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    backgroundColor:
                      isCorrectWord === true ? '#10b981' : isCorrectWord === false ? '#ef4444' : '#374151',
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                    backgroundColor: { duration: 0.5 },
                  }}
                  className={`
                    w-16 h-16 flex items-center justify-center 
                    border-2 rounded-lg font-bold text-2xl
                    transition-all duration-300 relative overflow-hidden
                    ${
                      isCorrectWord === true
                        ? 'border-green-400 shadow-lg shadow-green-400/50'
                        : isCorrectWord === false
                        ? 'border-red-400 shadow-lg shadow-red-400/50'
                        : 'border-gray-600'
                    }
                  `}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-yellow-500/10"
                    animate={{
                      rotate: collectedLetters[key] ? 360 : 0,
                      scale: collectedLetters[key] ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.6 }}
                  />

                  <span
                    className={`
                    relative z-10 transition-colors duration-300
                    ${isCorrectWord === true ? 'text-white' : isCorrectWord === false ? 'text-white' : 'text-red-400'}
                  `}
                  >
                    {collectedLetters[key]}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {isCorrectWord === true && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-4 text-center"
                >
                  <p className="text-green-400 font-bold text-lg">Felicidades 🥷 , pocos llegaron hasta aquí</p>
                  <p className="text-green-300 text-sm mt-1">
                    Un segundo enigma se encuentra entre nosotros, mantente alerta.
                  </p>
                </motion.div>
              )}

              {isCorrectWord === false && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-4 text-center"
                >
                  <p className="text-red-400 font-bold text-lg">❌ Código Incorrecto</p>
                  <p className="text-red-300 text-sm mt-1">No ha sido el momento adecuado...</p>
                </motion.div>
              )}

              {isCorrectWord === null && verificationCountdown !== null && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
                  <p className="text-yellow-400 text-lg font-bold">⏳ Verificando en {verificationCountdown}...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {isCorrectWord !== true && verificationCountdown === null && (
              <div className="mt-4 flex justify-center">
                <motion.div
                  className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-yellow-500"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 10, ease: 'linear' }}
                    key={progressBarKey}
                  />
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
