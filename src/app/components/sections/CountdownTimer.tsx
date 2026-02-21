'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BadgeJapaneseYen } from 'lucide-react';
import { mapTimeUnit } from '../../lib/japaneseAlphabetMapper';
import NinjaSecretMenu from '../NinjaSecretMenu';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CollectedLetters {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface CountdownTimerProps {
  onSecretWordFound: (word: string) => void;
}

export default function CountdownTimer({ onSecretWordFound }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [collectedLetters, setCollectedLetters] = useState<CollectedLetters>({
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
  });

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date('2027-01-15T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUnitClick = (index: number, unitKey: keyof CollectedLetters, timeValue: number) => {
    setClickedIndex(index);

    const newLetter = mapTimeUnit(unitKey, timeValue);
    setCollectedLetters((prev) => ({ ...prev, [unitKey]: newLetter }));

    if (!isMenuVisible) setIsMenuVisible(true);

    setTimeout(() => setClickedIndex(null), 800);
  };

  const handleMenuVisibilityChange = (visible: boolean) => {
    setIsMenuVisible(visible);

    if (!visible) {
      setCollectedLetters({
        days: '',
        hours: '',
        minutes: '',
        seconds: '',
      });
    }
  };

  if (!mounted) return null;

  const timeUnits = [
    { label: 'DÍAS', value: timeLeft.days, key: 'days' as const },
    { label: 'HORAS', value: timeLeft.hours, key: 'hours' as const },
    { label: 'MIN', value: timeLeft.minutes, key: 'minutes' as const },
    { label: 'SEG', value: timeLeft.seconds, key: 'seconds' as const },
  ];

  return (
    <section className="px-4">
      <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <BadgeJapaneseYen className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mr-2 sm:mr-4" />
            <h2 className="text-xl sm:text-4xl md:text-6xl font-bold text-white font-orbitron font-zenjirou">
              TIEMPO RESTANTE
            </h2>
            <BadgeJapaneseYen className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mr-2 sm:ml-4" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 font-jansina">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleTimeUnitClick(index, unit.key, unit.value)}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-yellow-500/20 rounded-lg sm:rounded-xl md:rounded-2xl blur-lg sm:blur-xl group-hover:blur-3xl transition-all duration-300"></div>

              <div className="relative bg-gradient-to-br from-zinc-900 to-black border border-red-500/30 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 hover:border-yellow-400/40 transition-all duration-300">
                <motion.div
                  animate={clickedIndex === index ? { rotate: 360, scale: 1.2 } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-1 sm:mb-2 font-orbitron"
                >
                  <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                    {clickedIndex === index ? '🥷' : String(unit.value).padStart(2, '0')}
                  </span>
                </motion.div>

                <div className="text-xs sm:text-sm md:text-base font-bold text-red-400 tracking-wider">
                  {unit.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-white text-xs sm:text-sm md:text-2xl font-jansina">
            La cuenta atrás ha comenzado... prepárate para lo inevitable.
          </p>
        </motion.div>

        <NinjaSecretMenu
          isVisible={isMenuVisible}
          collectedLetters={collectedLetters}
          onVisibilityChange={handleMenuVisibilityChange}
          onSecretFound={onSecretWordFound}
        />
      </div>
    </section>
  );
}
