import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

interface WizardStep {
  id: string;
  title: string;
  path: string;
  completed: boolean;
  current: boolean;
}

interface AppState {
  currentStep: number;
  walletConnected: boolean;
  githubConnected: boolean;
  chatMode: boolean;
  projectPlan: string;
  generatedCode: string;
  auditResults: string;
  testResults: string;
  deploymentStatus: string;
}

interface AppContextType {
  state: AppState;
  steps: WizardStep[];
  updateStep: (stepIndex: number) => void;
  completeStep: (stepIndex: number) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  connectGithub: () => Promise<void>;
  toggleChatMode: () => void;
  updateProjectPlan: (plan: string) => void;
  updateGeneratedCode: (code: string) => void;
  updateAuditResults: (results: string) => void;
  updateTestResults: (results: string) => void;
  updateDeploymentStatus: (status: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialSteps: WizardStep[] = [
  { id: 'info', title: 'INFO', path: '/wizard/info', completed: false, current: true },
  { id: 'plan', title: 'PLAN', path: '/wizard/plan', completed: false, current: false },
  { id: 'scaffold', title: 'SCAFFOLD', path: '/wizard/scaffold', completed: false, current: false },
  { id: 'audit', title: 'AUDIT', path: '/wizard/audit', completed: false, current: false },
  { id: 'test', title: 'TEST', path: '/wizard/test', completed: false, current: false },
  { id: 'deploy', title: 'DEPLOY', path: '/wizard/deploy', completed: false, current: false },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { connected: walletConnected, connect, disconnect } = useSolanaWallet();
  
  const [state, setState] = useState<AppState>({
    currentStep: 0,
    walletConnected: false,
    githubConnected: false,
    chatMode: false,
    projectPlan: '',
    generatedCode: '',
    auditResults: '',
    testResults: '',
    deploymentStatus: '',
  });

  const [steps, setSteps] = useState<WizardStep[]>(initialSteps);

  // Sync wallet connection state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      walletConnected: walletConnected
    }));
  }, [walletConnected]);

  // Check for existing connections on load
  useEffect(() => {
    if (user) {
      checkExistingConnections();
    }
  }, [user]);

  const checkExistingConnections = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_address, github_username')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setState(prev => ({
          ...prev,
          githubConnected: !!profile.github_username,
        }));
      }
    } catch (error) {
      console.error('Error checking connections:', error);
    }
  };

  const updateStep = (stepIndex: number) => {
    setState(prev => ({ ...prev, currentStep: stepIndex }));
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      current: index === stepIndex
    })));
  };

  const completeStep = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      completed: index === stepIndex ? true : step.completed
    })));
  };

  const connectWallet = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first to connect wallet');
      return;
    }
    
    try {
      console.log('Connecting wallet...');
      await connect();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    disconnect();
    console.log('WALLET_DISCONNECTED');
  };

  const connectGithub = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first to connect GitHub');
      return;
    }

    try {
      toast.loading('Connecting to GitHub...', { id: 'github-connect' });
      
      // Check if already connected
      const { data: profile } = await supabase
        .from('profiles')
        .select('github_access_token, github_username')
        .eq('user_id', user.id)
        .single();

      if (profile?.github_access_token) {
        setState(prev => ({ ...prev, githubConnected: true }));
        toast.success('GitHub already connected!', { id: 'github-connect' });
        return;
      }

      // Get GitHub OAuth URL
      const { data, error } = await supabase.functions.invoke('github-integration', {
        body: { action: 'auth-url' }
      });

      if (error) {
        console.error('GitHub OAuth URL error:', error);
        toast.error('Failed to get GitHub auth URL: ' + (error.message || 'Unknown error'), { id: 'github-connect' });
        return;
      }

      if (data?.authUrl) {
        toast.success('Redirecting to GitHub...', { id: 'github-connect' });
        // Open GitHub OAuth in same window
        window.location.href = data.authUrl;
      } else {
        toast.error('Failed to get GitHub authorization URL', { id: 'github-connect' });
      }
    } catch (error) {
      console.error('GitHub connection failed:', error);
      toast.error('GitHub connection failed: ' + (error instanceof Error ? error.message : 'Unknown error'), { id: 'github-connect' });
    }
  };

  const toggleChatMode = () => {
    setState(prev => ({ ...prev, chatMode: !prev.chatMode }));
  };

  const updateProjectPlan = (plan: string) => {
    setState(prev => ({ ...prev, projectPlan: plan }));
  };

  const updateGeneratedCode = (code: string) => {
    setState(prev => ({ ...prev, generatedCode: code }));
  };

  const updateAuditResults = (results: string) => {
    setState(prev => ({ ...prev, auditResults: results }));
  };

  const updateTestResults = (results: string) => {
    setState(prev => ({ ...prev, testResults: results }));
  };

  const updateDeploymentStatus = (status: string) => {
    setState(prev => ({ ...prev, deploymentStatus: status }));
  };

  return (
    <AppContext.Provider value={{
      state,
      steps,
      updateStep,
      completeStep,
      connectWallet,
      disconnectWallet,
      connectGithub,
      toggleChatMode,
      updateProjectPlan,
      updateGeneratedCode,
      updateAuditResults,
      updateTestResults,
      updateDeploymentStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
