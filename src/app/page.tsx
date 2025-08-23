'use client';
import React from 'react';
import { useState } from 'react';
import Hero from './components/sections/Hero';
import CountdownTimer from './components/sections/CountdownTimer';
import EmailSignup from './components/sections/EmailSignup';
import Footer from './components/sections/Footer';
import RainOverlay from './components/RainOverlay';

export default function Home() {
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [rainKey, setRainKey] = useState<number>(0);
  const [secretTargetWord, setSecretTargetWord] = useState<string | null>(null);

  const handleTriggerRain = () => {
    setRainKey((prev) => prev + 1);
    setIsRaining(true);
  };

  const handleSecretWordFound = (word: string) => {
    setSecretTargetWord(word);
  };
  return (
    <main className="min-h-screen bg-[url('/assets/image/wp_asiatico.webp')] bg-cover overflow-hidden relative">
      {isRaining && (
        <RainOverlay
          key={rainKey}
          active={true}
          density={4}
          speed={2}
          dropWidth={1.7}
          maxDropLength={25}
          showLetters={true}
        />
      )}
      <div className="relative z-10">
        <Hero onTriggerRain={handleTriggerRain} />
        <CountdownTimer onSecretWordFound={handleSecretWordFound} />
        <EmailSignup targetAnswer={secretTargetWord} />
        <Footer />
      </div>
    </main>
  );
}
