'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAccount, useSignMessage } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

export default function AuthPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { signMessageAsync } = useSignMessage();
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWalletConnect = async () => {
    if (!isConnected) {
      await open();
      return;
    }

    await handleAuthenticate();
  };

  const handleAuthenticate = async () => {
    if (!address) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate secure timestamp and nonce for message
      const timestamp = Date.now().toString();
      const nonce = crypto.randomUUID();
      
      // Create message to sign with timestamp and nonce for security
      const message = `Sign this message to authenticate with Blackjack Game.\n\nWallet: ${address}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
      
      // Request signature
      const signature = await signMessageAsync({ message });

      // Send to backend for verification
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message,
          timestamp,
          nonce,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      // Store session
      localStorage.setItem('blackjack_session', JSON.stringify({
        player: data.player,
        walletAddress: address,
        isNewUser: data.isNewUser,
      }));

      // Redirect to game
      router.push('/game');
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-3 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md border border-gray-700"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">🎰 Blackjack</h1>
          <p className="text-gray-400 text-sm md:text-base">Connect your wallet to play</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-2xl mb-4"
          >
            {error}
          </motion.div>
        )}

        {isConnected && (
          <div className="mb-5 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
            <p className="text-sm text-gray-400 mb-1">Connected Wallet</p>
            <p className="text-green-400 font-mono text-sm break-all">{address}</p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isConnected ? handleAuthenticate : handleWalletConnect}
          disabled={loading}
          className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
        >
          {loading ? 'Authenticating...' : isConnected ? 'Sign Message & Play' : 'Connect Wallet'}
        </motion.button>

        {isConnected && (
          <div className="mt-5 bg-blue-500/20 border border-blue-500 text-blue-400 px-4 py-3 rounded-2xl text-sm">
            ℹ️ You&apos;ll need to sign a message to verify wallet ownership
          </div>
        )}

        {!isConnected && (
          <div className="mt-6 bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded text-sm">
            💰 New players start with $1,000 bankroll!
          </div>
        )}
      </motion.div>
    </div>
  );
}
