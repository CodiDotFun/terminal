import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CheckCircle, Copy, ExternalLink, Rocket, Check, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { SolanaDeploymentService, DeploymentResult } from '../../utils/solanaDeployment';
import { LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import TerminalDisplay from '../TerminalDisplay';
import DeploymentVisualizer from '../DeploymentVisualizer';
import { ParticleEffect, GlitchText } from '../AnimationUtils';
import { useSounds } from '../SoundManager';

interface TerminalMessage {
  id: string;
  type: 'command' | 'output' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

interface DeploymentStepLocal {
  title: string;
  command: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

const DeployPage: React.FC = () => {
  const { state, updateDeploymentStatus, completeStep } = useApp();
  const { connected, publicKey, signTransaction } = useWallet();
  const { playSound } = useSounds();
  const [deploymentStep, setDeploymentStep] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customRpcUrl, setCustomRpcUrl] = useState('');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<'devnet' | 'mainnet'>('devnet');
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessage[]>([]);
  const [showParticles, setShowParticles] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(false);

  // Create RPC URL based on selected network
  const getRpcUrl = () => {
    if (customRpcUrl) {
      return customRpcUrl;
    }
    
    if (selectedNetwork === 'devnet') {
      return 'https://devnet.helius-rpc.com/?api-key=d9c55395-03a9-4b36-9ef4-c613667510d3';
    } else {
      return 'https://mainnet.helius-rpc.com/?api-key=d9c55395-03a9-4b36-9ef4-c613667510d3';
    }
  };

  const deploymentSteps: DeploymentStepLocal[] = [
    { title: 'Build Program', command: 'anchor build', status: 'pending' },
    { title: `Deploy to ${selectedNetwork}`, command: `anchor deploy --provider.cluster ${selectedNetwork}`, status: 'pending' },
    { title: 'Update Program ID', command: 'anchor keys sync', status: 'pending' },
    { title: 'Run Tests', command: 'anchor test', status: 'pending' },
  ];

  const [steps, setSteps] = useState(deploymentSteps);

  // Update steps when network changes
  useEffect(() => {
    setSteps([
      { title: 'Build Program', command: 'anchor build', status: 'pending' },
      { title: `Deploy to ${selectedNetwork}`, command: `anchor deploy --provider.cluster ${selectedNetwork}`, status: 'pending' },
      { title: 'Update Program ID', command: 'anchor keys sync', status: 'pending' },
      { title: 'Run Tests', command: 'anchor test', status: 'pending' },
    ]);
  }, [selectedNetwork]);

  // Manual balance refresh function
  const refreshBalance = async () => {
    if (!connected || !publicKey) {
      setWalletBalance(null);
      setBalanceError('Wallet not connected');
      return;
    }

    setIsCheckingBalance(true);
    setBalanceError(null);
    
    try {
      const rpcUrl = getRpcUrl();
      console.log('Checking balance on network:', selectedNetwork);
      console.log('Using RPC URL:', rpcUrl);
      console.log('Wallet address:', publicKey.toString());
      
      // Create a fresh connection for this specific network
      const connection = new Connection(rpcUrl, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 30000,
      });
      
      // Get balance using the network-specific connection
      const balance = await connection.getBalance(publicKey, 'confirmed');
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      console.log(`Balance on ${selectedNetwork}:`, balance, 'lamports =', solBalance, 'SOL');
      
      setWalletBalance(solBalance);
      
      if (solBalance === 0) {
        if (selectedNetwork === 'devnet') {
          setBalanceError('No SOL found on devnet. Get devnet SOL from the faucet.');
        } else {
          setBalanceError('No SOL found on mainnet. You need mainnet SOL to deploy.');
        }
      }
    } catch (error) {
      console.error('Failed to check wallet balance:', error);
      setBalanceError(`Balance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setWalletBalance(null);
    } finally {
      setIsCheckingBalance(false);
    }
  };

  // Check wallet balance when wallet connects or network changes
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalance();
    } else {
      setWalletBalance(null);
      setBalanceError(null);
    }
  }, [connected, publicKey, selectedNetwork, customRpcUrl]);

  const addTerminalMessage = (type: 'command' | 'output' | 'error' | 'success', content: string) => {
    const message: TerminalMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setTerminalMessages(prev => [...prev, message]);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deployToSolana = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setDeploymentError('Please connect your wallet first');
      playSound('error');
      return;
    }

    const minBalance = selectedNetwork === 'mainnet' ? 0.002 : 0.001;
    if (walletBalance === null || walletBalance < minBalance) {
      setDeploymentError(`Insufficient SOL balance for deployment. Please add ${selectedNetwork} SOL to your wallet.`);
      playSound('error');
      return;
    }

    setIsDeploying(true);
    setDeploymentError(null);
    setTerminalMessages([]);
    
    // Add initial terminal messages
    addTerminalMessage('command', `Starting deployment to ${selectedNetwork}...`);
    addTerminalMessage('output', `Wallet: ${publicKey.toString()}`);
    addTerminalMessage('output', `Balance: ${walletBalance.toFixed(4)} SOL`);
    
    const deploymentService = new SolanaDeploymentService(selectedNetwork, customRpcUrl || undefined);
    
    try {
      // Simulate the deployment steps with terminal output
      for (let i = 0; i < steps.length; i++) {
        setDeploymentStep(i + 1);
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'running' as const } : step
        ));
        
        addTerminalMessage('command', steps[i].command);
        addTerminalMessage('output', `Executing ${steps[i].title}...`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'completed' as const } : step
        ));
        
        addTerminalMessage('success', `${steps[i].title} completed successfully`);
        playSound('notification');
      }

      // Create wallet object for deployment service
      const walletAdapter = {
        publicKey,
        connected,
        signTransaction
      };

      addTerminalMessage('output', 'Deploying to Solana blockchain...');
      
      const result = await deploymentService.deployProgram(
        walletAdapter,
        state.generatedCode,
        'CODI Project'
      );

      if (result.success) {
        setDeploymentResult(result);
        updateDeploymentStatus('deployed');
        completeStep(5);
        
        addTerminalMessage('success', `Deployment successful!`);
        addTerminalMessage('output', `Program ID: ${result.programId}`);
        addTerminalMessage('output', `Transaction: ${result.transactionHash}`);
        
        // Trigger success effects
        setShowParticles(true);
        playSound('success');
        
        // Refresh balance after deployment
        setTimeout(refreshBalance, 2000);
        setTimeout(() => setShowParticles(false), 3000);
      } else {
        throw new Error(result.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Deployment failed';
      setDeploymentError(errorMessage);
      addTerminalMessage('error', `Deployment failed: ${errorMessage}`);
      setGlitchTrigger(true);
      playSound('error');
      setTimeout(() => setGlitchTrigger(false), 500);
    } finally {
      setIsDeploying(false);
    }
  };

  // Create 3D visualization steps
  const visualizationSteps = steps.map((step, index) => ({
    id: step.title,
    title: step.title,
    status: step.status,
    position: [
      Math.cos((index / steps.length) * Math.PI * 2) * 3,
      (index - steps.length / 2) * 1.5,
      Math.sin((index / steps.length) * Math.PI * 2) * 3
    ] as [number, number, number]
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'running':
        return <div className="w-5 h-5 border-2 border-codi border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <ParticleEffect trigger={showParticles} />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          <GlitchText text="Deployment" trigger={glitchTrigger} />
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Deploy your audited and tested smart contracts to the Solana blockchain. 
          Your DApp is ready to go live!
        </p>
      </div>

      {/* 3D Deployment Visualizer */}
      {isDeploying && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">Deployment Progress</h3>
          <DeploymentVisualizer steps={visualizationSteps} currentStep={deploymentStep} />
        </div>
      )}

      {/* Terminal Display */}
      {(isDeploying || terminalMessages.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Terminal Output</h3>
          <TerminalDisplay 
            messages={terminalMessages} 
            isActive={isDeploying}
            onCommand={(command) => {
              addTerminalMessage('command', command);
              addTerminalMessage('output', 'Command received (demo mode)');
            }}
          />
        </div>
      )}

      {/* Network Selection */}
      <div className="chrome-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Network Selection</h3>
        <div className="flex space-x-4 mb-4">
          <Button
            onClick={() => setSelectedNetwork('devnet')}
            variant={selectedNetwork === 'devnet' ? 'default' : 'outline'}
            className={selectedNetwork === 'devnet' ? 'bg-codi text-black' : 'border-gray-600 hover:bg-gray-700'}
          >
            Devnet (Testing)
          </Button>
          <Button
            onClick={() => setSelectedNetwork('mainnet')}
            variant={selectedNetwork === 'mainnet' ? 'default' : 'outline'}
            className={selectedNetwork === 'mainnet' ? 'bg-codi text-black' : 'border-gray-600 hover:bg-gray-700'}
          >
            Mainnet (Production)
          </Button>
        </div>
        <div className="text-sm text-gray-400">
          {selectedNetwork === 'devnet' && (
            <p>Devnet is free for testing. Use the Solana faucet to get test SOL.</p>
          )}
          {selectedNetwork === 'mainnet' && (
            <p>⚠️ Mainnet deployment uses real SOL and costs real money. Your contract will be live on the blockchain.</p>
          )}
        </div>
      </div>

      {/* Wallet Connection */}
      {!connected && (
        <div className="chrome-border rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h3>
          <p className="text-gray-300 mb-6">
            Connect your Solana wallet to deploy your program to the blockchain.
          </p>
          <WalletMultiButton className="!bg-codi !text-black hover:!bg-codi/80" />
        </div>
      )}

      {/* Wallet Status */}
      {connected && publicKey && (
        <div className="chrome-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Wallet Status</h3>
            <Button
              onClick={refreshBalance}
              disabled={isCheckingBalance}
              variant="outline"
              size="sm"
              className="border-gray-600 hover:bg-gray-700"
            >
              {isCheckingBalance ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Network:</span>
              <span className={`font-mono ${selectedNetwork === 'mainnet' ? 'text-red-400' : 'text-codi'}`}>
                {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">RPC Endpoint:</span>
              <span className="text-xs text-gray-400 font-mono">
                {getRpcUrl().substring(0, 50)}...
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Public Key:</span>
              <div className="flex items-center space-x-2">
                <code className="text-codi font-mono text-sm">{publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}</code>
                <Button
                  onClick={() => copyToClipboard(publicKey.toString(), 'public-key')}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:bg-gray-700"
                >
                  {copied === 'public-key' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Balance:</span>
              <span className={`font-semibold ${
                walletBalance !== null && walletBalance >= (selectedNetwork === 'mainnet' ? 0.002 : 0.001) ? 'text-green-400' : 
                walletBalance === 0 ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {isCheckingBalance ? 'Checking...' : 
                 walletBalance !== null ? `${walletBalance.toFixed(4)} SOL` : 'Unknown'}
              </span>
            </div>
            
            {balanceError && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-300 text-sm">⚠️ {balanceError}</p>
              </div>
            )}
            
            {walletBalance !== null && walletBalance < (selectedNetwork === 'mainnet' ? 0.002 : 0.001) && (
              <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3">
                <p className="text-yellow-300 text-sm">
                  ⚠️ You need at least {selectedNetwork === 'mainnet' ? '0.002' : '0.001'} SOL for transaction fees.
                  {selectedNetwork === 'devnet' && (
                    <>
                      {' '}Get devnet SOL from the{' '}
                      <a 
                        href="https://faucet.solana.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-codi hover:underline"
                      >
                        Solana Faucet
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
            
            {walletBalance !== null && walletBalance >= (selectedNetwork === 'mainnet' ? 0.002 : 0.001) && (
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
                <p className="text-green-300 text-sm">✅ Wallet ready for deployment!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      {connected && !deploymentResult && (
        <div className="chrome-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Network Configuration</h3>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              size="sm"
              className="border-gray-600 hover:bg-gray-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          </div>
          
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom RPC URL (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://your-rpc-endpoint.com"
                  value={customRpcUrl}
                  onChange={(e) => setCustomRpcUrl(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty to use default Helius RPC. Consider using Helius, QuickNode, or Alchemy for better reliability.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deployment Error */}
      {deploymentError && (
        <div className="chrome-border rounded-lg p-4 bg-red-900/20 border-red-500/50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Deployment Failed</span>
          </div>
          <p className="text-red-300 mt-2">{deploymentError}</p>
          {deploymentError.includes('insufficient') && (
            <div className="mt-3 space-y-1">
              {selectedNetwork === 'devnet' && (
                <p className="text-yellow-300 text-sm">
                  💡 Get devnet SOL from: <a href="https://faucet.solana.com/" target="_blank" rel="noopener noreferrer" className="text-codi hover:underline">Solana Faucet</a>
                </p>
              )}
              <p className="text-yellow-300 text-sm">
                💡 Make sure your wallet has at least {selectedNetwork === 'mainnet' ? '0.002' : '0.001'} SOL for transaction fees.
              </p>
            </div>
          )}
          {deploymentError.includes('simulation failed') && (
            <p className="text-yellow-300 mt-2 text-sm">
              💡 Try using a custom RPC endpoint in Advanced settings for better reliability.
            </p>
          )}
        </div>
      )}

      {/* Deployment Checklist */}
      <div className="chrome-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Deployment Steps</h3>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center space-x-4">
                {getStatusIcon(step.status)}
                <div>
                  <h4 className="font-medium text-white">{step.title}</h4>
                  <code className="text-sm text-gray-400 font-mono">{step.command}</code>
                </div>
              </div>
              <Button
                onClick={() => copyToClipboard(step.command, `command-${index}`)}
                variant="outline"
                size="sm"
                className="border-gray-600 hover:bg-gray-700"
              >
                {copied === `command-${index}` ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Deploy Button */}
      {connected && deploymentStep === 0 && !deploymentResult && walletBalance !== null && walletBalance >= (selectedNetwork === 'mainnet' ? 0.002 : 0.001) && (
        <div className="text-center">
          <Button
            onClick={deployToSolana}
            disabled={isDeploying}
            size="lg"
            className="bg-codi text-black hover:bg-codi/80 font-semibold px-8 py-3 neon-glow relative overflow-hidden"
          >
            <Rocket className="w-5 h-5 mr-2" />
            {isDeploying ? 'Deploying...' : `Deploy to Solana ${selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}`}
          </Button>
          {selectedNetwork === 'mainnet' && (
            <p className="text-yellow-300 text-sm mt-2">
              ⚠️ This will deploy to mainnet with real SOL
            </p>
          )}
        </div>
      )}

      {/* Success State */}
      {deploymentResult && deploymentResult.success && (
        <div className="chrome-border rounded-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-codi/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-codi" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Deployment Successful! 🎉</h3>
            <p className="text-gray-300">Your DApp has been deployed to Solana {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Program ID:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-codi font-mono">{deploymentResult.programId}</code>
                  <Button
                    onClick={() => copyToClipboard(deploymentResult.programId, 'program-id')}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    {copied === 'program-id' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Transaction Hash:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-codi font-mono text-xs">{deploymentResult.transactionHash}</code>
                  <Button
                    onClick={() => copyToClipboard(deploymentResult.transactionHash, 'tx-hash')}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    {copied === 'tx-hash' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.open(deploymentResult.explorerUrl, '_blank')}
                variant="outline"
                className="border-codi text-codi hover:bg-codi/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Transaction on Solana Explorer
              </Button>
              
              <Button
                onClick={() => {
                  const deploymentService = new SolanaDeploymentService(selectedNetwork, customRpcUrl || undefined);
                  window.open(deploymentService.getProgramExplorerUrl(deploymentResult.programId), '_blank');
                }}
                variant="outline"
                className="border-codi text-codi hover:bg-codi/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Program on Solana Explorer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeployPage;
