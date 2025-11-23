import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia, polygon, polygonAmoy, mainnet, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

// WalletConnect Project ID - Para desarrollo local, puedes usar un ID temporal
// Obtén uno gratis en: https://cloud.walletconnect.com
// Por ahora usamos un ID público para desarrollo (no recomendado para producción)
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c07c0141c2055890e9dc47e03a134223';

const config = getDefaultConfig({
  appName: 'Origin',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [polygon, polygonAmoy, baseSepolia, base, sepolia, mainnet], // Polygon primero
  ssr: false,
});

const queryClient = new QueryClient();

export function WagmiProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

