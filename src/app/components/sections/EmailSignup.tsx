'use client';

import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

type EmailSignupProps = {
  targetAnswer?: string | null;
};

export default function EmailSignup({ targetAnswer }: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const [puzzle1, setPuzzle1] = useState<string>('');

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const submitSignUp = async (data: any): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return 'Registrado correctamente en el dojo ninja';
  };

  const handlePuzzle1Change = (value: string) => {
    setPuzzle1(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailTrimmed = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setStatus('error');
      setMessage('Por favor, introduce un email valido');
      return;
    }

    setMessage('');
    setStatus('idle');

    try {
      const payload = {
        mail: emailTrimmed,
        riddleSecretJapan: targetAnswer ?? '',
        riddleRainLetters: puzzle1.trim() ?? '',
      };

      setIsSubmittingForm(true);

      const apiMessage = await submitSignUp(payload);

      setStatus('success');
      setMessage(apiMessage ?? 'Registrado correctamente');

      setEmail('');
      setPuzzle1('');
    } catch (err: any) {
      console.error('Error submitSignUp:', err);
      setMessage(err?.message ?? 'No se pudo enviar el formulario. Inténtalo de nuevo.');
      setStatus('error');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const isDisabled = status === 'success' || isSubmittingForm;

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white mb-4 font-orbitron">
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent font-zenjirou">
              UNETE AL DOJO
            </span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-2xl leading-relaxed font-jansina">
            Cuando llegue el momento, recibirás la llamada del sensei en tu correo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-xl sm:rounded-2xl blur-2xl"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            ></motion.div>

            <motion.div
              className="relative bg-gradient-to-br from-zinc-900/90 to-black/90 border border-red-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm"
              whileHover={{
                borderColor: 'rgba(239, 68, 68, 0.5)',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)',
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                <div>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isDisabled}
                      className="w-full h-12 sm:h-14 px-4 bg-black/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 text-sm sm:text-base md:text-lg font-rajdhani transition-all duration-300 hover:border-red-400/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none disabled:opacity-50 font-jansina tracking-widest"
                    />
                  </motion.div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Introduce la palabra secreta..."
                      value={puzzle1}
                      onChange={(e) => handlePuzzle1Change(e.target.value)}
                      disabled={isDisabled}
                      className="w-full h-12 sm:h-14 px-4 bg-black/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 text-sm sm:text-base md:text-lg font-rajdhani transition-all duration-300 hover:border-red-400/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none disabled:opacity-50 font-jansina tracking-widest"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={targetAnswer ?? ''}
                      readOnly
                      placeholder="Se autocompletará al acertar"
                      tabIndex={-1}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseDown={(e) => e.preventDefault()}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x')) e.preventDefault();
                      }}
                      style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        pointerEvents: 'none',
                      }}
                      className={`w-full h-12 px-3 bg-black/40 border rounded-lg text-sm sm:text-base md:text-lg font-rajdhani transition-all duration-300 font-jansina tracking-widest focus:outline-none ${'border-zinc-700 text-gray-400'}`}
                      aria-readonly
                      disabled
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="w-full"
                  >
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className="h-12 sm:h-14 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm sm:text-base md:text-lg rounded-lg disabled:opacity-50 font-orbitron w-full relative overflow-hidden group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="flex items-center justify-center relative z-10">
                        {isSubmittingForm && (
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2"></div>
                        )}
                        {status === 'success' && <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                        {status === 'idle' && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                        {status === 'error' && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}

                        <span className="font-jansina tracking-wider">
                          {isSubmittingForm ? 'PROCESANDO...' : status === 'success' ? 'REGISTRADO' : 'UNIRSE'}
                        </span>
                      </div>
                    </button>
                  </motion.div>
                </div>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg flex items-center justify-center ${
                    status === 'success'
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  {status === 'success' ? (
                    <>
                      <ArrowRight className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium font-zenjirou">
                        Tu formulario ha sido enviado correctamente
                      </span>
                      <ArrowRight className="w-5 h-5 ms-3 flex-shrink-0 rotate-y-180" />
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium font-zenjirou">{message}</span>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
