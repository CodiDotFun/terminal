
interface SolanaWallet {
  isPhantom?: boolean;
  isSolflare?: boolean;
  publicKey: import('@solana/web3.js').PublicKey | null;
  isConnected: boolean;
  signTransaction: (transaction: import('@solana/web3.js').Transaction) => Promise<import('@solana/web3.js').Transaction>;
  signAllTransactions: (transactions: import('@solana/web3.js').Transaction[]) => Promise<import('@solana/web3.js').Transaction[]>;
  connect: () => Promise<{ publicKey: import('@solana/web3.js').PublicKey }>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    solana?: SolanaWallet;
    phantom?: {
      solana?: SolanaWallet;
    };
    solflare?: SolanaWallet;
  }
}

export {};
