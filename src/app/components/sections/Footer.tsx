'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-8 sm:py-16 md:py-18 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <span className="text-lg sm:text-2xl font-bold text-white font-zenjirou">Iniciativa Ninja</span>
        </div>

        <div data-testid="separator-line" className="w-72 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-6"></div>

        <p className="text-gray-100 sm:text-lg md:text-xl mb-6 max-w-lg sm:max-w-2xl mx-auto font-jansina">
          Algo se oculta aquí. Sé precavido, sigue tu instinto ninja y descubre lo que pocos ven.
        </p>
      </motion.div>
    </footer>
  );
}
