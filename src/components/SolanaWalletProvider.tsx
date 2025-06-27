
import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

interface Props {
  children: React.ReactNode;
  network?: WalletAdapterNetwork;
  customRpcUrl?: string;
}

const SolanaWalletProvider: React.FC<Props> = ({ 
  children, 
  network = WalletAdapterNetwork.Devnet,
  customRpcUrl
}) => {
  const endpoint = useMemo(() => {
    if (customRpcUrl) {
      return customRpcUrl;
    }
    return clusterApiUrl(network);
  }, [network, customRpcUrl]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  console.log('SolanaWalletProvider using endpoint:', endpoint);
  console.log('SolanaWalletProvider using network:', network);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
