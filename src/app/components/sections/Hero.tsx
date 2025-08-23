'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  onTriggerRain: () => void;
}

export default function Hero({ onTriggerRain }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-6xl mx-auto relative z-10 flex flex-col items-center gap-7 lg:gap-0">
        <motion.h1
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
          }}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 leading-tight"
        >
          <motion.span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent font-ninjakage">
            INICIATIVA
          </motion.span>
          <br />
          <span className="bg-gradient-to-r from-red-200 via-red-500 to-red-700 bg-clip-text text-transparent font-ninjakage">
            NINJA
          </span>
          <br />
          <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent font-zenjirou text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            WAITLIST
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
          }}
          className="text-base sm:text-lg md:text-xl lg:text-xl text-white my-8 pt-8 sm:mb-12 max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed font-ninjakage"
        >
          Algo se está forjando en las sombras.
          <br />
          Solo unos pocos estarán listos cuando llegue el momento.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          transition: {
            default: { type: 'spring' },
            opacity: { ease: 'easeIn', duration: 3, delay: 1 },
          },
        }}
        className="absolute z-10 top-3/8 -right-4 lg:right-0 lg:top-auto lg:bottom-80 xl:bottom-30 2xl:bottom-20  sm:left-12 md:left-16 lg:left-20 xl:left-30 2xl:left-30"
      >
        <button
          onClick={onTriggerRain}
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 2xl:w-72 2xl:h-72 hover:cursor-pointer hover:opacity-70 transition-opacity duration-600"
        >
          <Image
            src="/assets/image/ninja_avatar_pose_rodillas_humo.webp"
            alt="ninja_avatar_pose_rodillas"
            fill
            className="object-contain"
            priority
          />
        </button>
      </motion.div>
    </section>
  );
}
