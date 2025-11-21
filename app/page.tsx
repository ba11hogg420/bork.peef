'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const sessionData = localStorage.getItem('blackjack_session');
    if (sessionData) {
      router.push('/game');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center px-3 py-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header with card suits animation */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex justify-center items-center gap-4 mb-4">
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl"
              >
                ♠️
              </motion.span>
              <motion.span
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="text-6xl"
              >
                ♥️
              </motion.span>
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="text-6xl"
              >
                ♣️
              </motion.span>
              <motion.span
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="text-6xl"
              >
                ♦️
              </motion.span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4 tracking-tight"
          >
            BLACKJACK
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-1"
          >
            <p className="text-xl md:text-2xl font-semibold text-gray-200">
              Premium Two-Deck Casino Experience
            </p>
            <p className="text-base md:text-lg text-yellow-400/80 font-medium">
              Authentic Rules • Real-Time Competition • Web3 Powered
            </p>
          </motion.div>
        </motion.div>

        {/* Main action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mb-10 md:mb-14"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(234, 179, 8, 0.7)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/auth')}
            className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold text-lg md:text-xl py-5 px-10 md:py-6 md:px-14 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-3">
              <span className="text-2xl">🔐</span>
              <span>Connect Wallet & Play</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8 md:mb-10"
        >
          {[
            { icon: '🔐', title: 'Web3 Auth', desc: 'MetaMask, WalletConnect & more', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
            { icon: '💰', title: '$1,000 Start', desc: 'Generous starting bankroll', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
            { icon: '🏆', title: 'Leaderboard', desc: 'Real-time global rankings', color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' },
            { icon: '⚡', title: 'Full Features', desc: 'Split, double, insurance', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + idx * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm rounded-2xl p-5 md:p-6 border shadow-lg hover:shadow-2xl transition-all`}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-5xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Game rules banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-gray-700/50 shadow-2xl"
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Authentic Casino Rules</h2>
            <div className="grid md:grid-cols-3 gap-6 text-gray-300">
              <div className="space-y-2">
                <div className="text-3xl mb-2">🎴</div>
                <p className="font-semibold text-white">Two Decks</p>
                <p className="text-sm text-gray-400">Professional casino setup</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">🎯</div>
                <p className="font-semibold text-white">Dealer Stands S17</p>
                <p className="text-sm text-gray-400">Classic house rules</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">💎</div>
                <p className="font-semibold text-white">3:2 Blackjack</p>
                <p className="text-sm text-gray-400">Fair payout ratios</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-sm">
            Built with ♠️ for the next generation of players
          </p>
        </motion.div>
      </div>
    </div>
  );
}
