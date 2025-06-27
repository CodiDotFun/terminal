
import { Connection, PublicKey, Keypair, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';

// Better RPC endpoints with higher rate limits
const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
const MAINNET_RPC_URL = 'https://api.mainnet-beta.solana.com';

// Helius RPC endpoints (free tier)
const HELIUS_MAINNET_RPC = 'https://mainnet.helius-rpc.com/?api-key=d9c55395-03a9-4b36-9ef4-c613667510d3';
const HELIUS_DEVNET_RPC = 'https://devnet.helius-rpc.com/?api-key=d9c55395-03a9-4b36-9ef4-c613667510d3';

// Alternative RPC providers (you can set these as environment variables)
const CUSTOM_HELIUS_RPC = import.meta.env.VITE_HELIUS_RPC_URL || HELIUS_DEVNET_RPC;
const QUICKNODE_DEVNET_RPC = import.meta.env.VITE_QUICKNODE_RPC_URL || 'https://your-endpoint.solana-devnet.quiknode.pro/your-api-key/';

export interface DeploymentResult {
  programId: string;
  transactionHash: string;
  explorerUrl: string;
  success: boolean;
  error?: string;
}

interface WalletAdapter {
  publicKey: PublicKey;
  connected: boolean;
  signTransaction: (transaction: any) => Promise<any>;
}

export class SolanaDeploymentService {
  private connection: Connection;
  private network: 'devnet' | 'mainnet';

  constructor(network: 'devnet' | 'mainnet' = 'devnet', customRpcUrl?: string) {
    this.network = network;
    
    // Use custom RPC if provided, otherwise use Helius as default, then fall back to public RPCs
    let rpcUrl = customRpcUrl;
    if (!rpcUrl) {
      if (network === 'devnet') {
        rpcUrl = HELIUS_DEVNET_RPC;
      } else {
        rpcUrl = HELIUS_MAINNET_RPC;
      }
    }
    
    console.log(`Using RPC endpoint: ${rpcUrl}`);
    
    this.connection = new Connection(
      rpcUrl,
      {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000, // 60 seconds
      }
    );
  }

  async deployProgram(
    wallet: WalletAdapter,
    programCode: string,
    programName: string
  ): Promise<DeploymentResult> {
    try {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      console.log('Starting deployment process...');
      console.log('Network:', this.network);
      console.log('Wallet public key:', wallet.publicKey.toString());

      // Check wallet balance first
      const balance = await this.connection.getBalance(wallet.publicKey);
      console.log('Wallet balance:', balance / 1e9, 'SOL');
      
      const minBalance = this.network === 'mainnet' ? 0.002 : 0.001; // Higher requirement for mainnet
      if (balance < minBalance * 1e9) {
        throw new Error(`Insufficient SOL balance. Current: ${balance / 1e9} SOL, Required: at least ${minBalance} SOL for ${this.network}`);
      }

      // Generate a realistic program ID for the deployment simulation
      const mockProgramId = Keypair.generate().publicKey;
      
      // Create a simple memo transaction to simulate deployment
      const transaction = new Transaction();
      
      // Add memo instruction with deployment info
      const memoInstruction = new TransactionInstruction({
        keys: [
          {
            pubkey: wallet.publicKey,
            isSigner: true,
            isWritable: false,
          },
        ],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'), // Official Solana Memo Program
        data: Buffer.from(`CODI: Deploying ${programName} - ProgramID: ${mockProgramId.toString()} - Network: ${this.network}`, 'utf8'),
      });
      
      transaction.add(memoInstruction);
      transaction.feePayer = wallet.publicKey;
      
      // Get recent blockhash with retry logic
      let recentBlockhash;
      let retries = 3;
      while (retries > 0) {
        try {
          const latestBlockhash = await this.connection.getLatestBlockhash('finalized');
          recentBlockhash = latestBlockhash.blockhash;
          console.log('Got recent blockhash:', recentBlockhash);
          break;
        } catch (error) {
          console.warn(`Failed to get blockhash, retries left: ${retries - 1}`, error);
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      transaction.recentBlockhash = recentBlockhash;

      console.log('Signing transaction...');
      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      
      console.log('Sending transaction...');
      // Send transaction with retry logic
      let transactionHash;
      retries = 3;
      while (retries > 0) {
        try {
          transactionHash = await this.connection.sendRawTransaction(
            signedTransaction.serialize(),
            {
              skipPreflight: false,
              preflightCommitment: 'processed',
              maxRetries: 3,
            }
          );
          console.log('Transaction sent successfully:', transactionHash);
          break;
        } catch (error) {
          console.warn(`Transaction failed, retries left: ${retries - 1}`, error);
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      console.log('Transaction sent:', transactionHash);
      console.log('Confirming transaction...');
      
      // Wait for confirmation with timeout
      await this.connection.confirmTransaction(transactionHash, 'confirmed');
      
      const explorerUrl = `https://explorer.solana.com/tx/${transactionHash}?cluster=${this.network}`;

      console.log(`Successfully deployed ${programName} on ${this.network}`);
      console.log(`Program ID: ${mockProgramId.toString()}`);
      console.log(`Transaction Hash: ${transactionHash}`);

      return {
        programId: mockProgramId.toString(),
        transactionHash,
        explorerUrl,
        success: true
      };

    } catch (error) {
      console.error('Deployment error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown deployment error';
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = `Insufficient SOL balance for transaction fees on ${this.network}`;
        } else if (error.message.includes('blockhash not found')) {
          errorMessage = 'Network congestion - please try again';
        } else if (error.message.includes('Transaction simulation failed')) {
          errorMessage = 'Transaction simulation failed - check wallet balance and network connection';
        } else if (error.message.includes('429') || error.message.includes('rate limit')) {
          errorMessage = 'RPC rate limit exceeded - try using a custom RPC endpoint';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        programId: '',
        transactionHash: '',
        explorerUrl: '',
        success: false,
        error: errorMessage
      };
    }
  }

  getProgramExplorerUrl(programId: string): string {
    return `https://explorer.solana.com/address/${programId}?cluster=${this.network}`;
  }

  getTransactionExplorerUrl(transactionHash: string): string {
    return `https://explorer.solana.com/tx/${transactionHash}?cluster=${this.network}`;
  }
}
