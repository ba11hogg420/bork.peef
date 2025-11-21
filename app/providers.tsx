'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { wagmiAdapter, projectId, metadata, networks } from '@/lib/web3';

// Create Reown AppKit modal with full features including Auth, wallet creation, and legal terms
/* eslint-disable @typescript-eslint/no-explicit-any */
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks as any,
  defaultNetwork: networks[0] as any,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'github', 'discord', 'x'],
    onramp: true,
    swaps: true,
    allWallets: true,
    emailShowWallets: true,
  },
  termsConditionsUrl: 'https://reown.com/terms-of-service',
  privacyPolicyUrl: 'https://reown.com/privacy-policy',
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#eab308',
    '--w3m-border-radius-master': '16px',
    '--w3m-z-index': 9999
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 2,
        staleTime: 30000, // 30 seconds
        gcTime: 5 * 60 * 1000 // 5 minutes
      },
      mutations: {
        retry: 1
      }
    }
  }));

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
