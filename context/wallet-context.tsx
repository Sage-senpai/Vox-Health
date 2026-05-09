'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { WalletContextType } from '@/types';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connect = useCallback(async () => {
    setIsLoading(true);
    try {
      // Placeholder: In real app, use Phantom or Ledger wallet
      console.log('[VoxHealth] Wallet: mock connection initiated');
      setPublicKey('placeholder-public-key-' + Date.now().toString().slice(-8));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
  }, []);

  const value: WalletContextType = {
    publicKey,
    isConnected: !!publicKey,
    isLoading,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
