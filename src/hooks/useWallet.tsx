
import { useState, useEffect } from 'react';
import { useConnection, useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useWallet = () => {
  const { publicKey, connect, disconnect, connected, connecting } = useSolanaWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Update app context when wallet connection changes
  useEffect(() => {
    if (connected && publicKey && user) {
      console.log('Wallet connected:', publicKey.toString());
      updateWalletInProfile();
    }
  }, [connected, publicKey, user]);

  const updateWalletInProfile = async () => {
    if (!publicKey || !user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          wallet_address: publicKey.toString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating wallet address:', error);
        toast.error('Failed to save wallet address');
      } else {
        console.log('Wallet connected and saved:', publicKey.toString());
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Error updating wallet address:', error);
      toast.error('Failed to save wallet address');
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      console.log('Opening wallet selection modal...');
      
      // Open the wallet selection modal
      setVisible(true);
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      
      if (user) {
        // Clear wallet address from profile
        const { error } = await supabase
          .from('profiles')
          .update({
            wallet_address: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error clearing wallet address:', error);
          toast.error('Failed to clear wallet address');
        } else {
          toast.success('Wallet disconnected');
        }
      }
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  return {
    publicKey,
    connected,
    connecting,
    loading: loading || connecting,
    connectWallet,
    disconnectWallet,
  };
};
