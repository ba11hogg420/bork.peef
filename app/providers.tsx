'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider } from 'wagmi';
import { wagmiAdapter, projectId, metadata, networks } from '@/lib/web3';

// Create Reown AppKit modal with project branding visible
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: networks[0],
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
    onramp: false
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#eab308',
    '--w3m-border-radius-master': '16px',
    '--w3m-z-index': '9999'
  },
  enableWalletGuide: true,
  enableWallets: true
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
