
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import VersionSelector from './VersionSelector';

const Header: React.FC = () => {
  const { state, connectGithub, toggleChatMode } = useApp();
  const { user, logout, loading } = useAuth();
  const { connected, connectWallet, disconnectWallet, loading: walletLoading } = useWallet();
  const navigate = useNavigate();
  const [githubLoading, setGithubLoading] = useState(false);

  const handleGitHubConnect = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setGithubLoading(true);
    try {
      await connectGithub();
      console.log('GITHUB_OAUTH_INITIATED');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleWalletConnect = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    connectWallet();
  };

  const handleWalletDisconnect = () => {
    disconnectWallet();
  };

  if (loading) {
    return (
      <header className="glass-panel border-b border-white/10 relative scan-lines">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="text-codi font-mono">LOADING_TERMINAL...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="glass-panel border-b border-white/10 relative scan-lines">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Version */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
              <img 
                src="/lovable-uploads/730474d9-3e94-4082-b108-47235646ad28.png" 
                alt="CODI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-cyber text-white cursor">
                CODI <span className="text-codi neon-text">TERMINAL</span>
              </h1>
              <div className="hidden sm:block">
                <VersionSelector />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Version Selector */}
        <div className="block sm:hidden">
          <VersionSelector />
        </div>

        {/* Navigation Actions */}
        <div className="hidden sm:flex items-center space-x-4">
          {/* Chat Mode Toggle */}
          {user && (
            <Button
              onClick={toggleChatMode}
              variant="outline"
              className={`terminal-border bg-transparent text-white hover:bg-white/5 font-mono ${
                state.chatMode ? 'neon-border text-codi' : ''
              }`}
            >
              {state.chatMode ? '>_ CHAT_ACTIVE' : '>_ CHAT_MODE'}
            </Button>
          )}

          {/* Authentication */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="terminal-border bg-transparent text-codi hover:bg-codi/10 font-mono"
              >
                DASHBOARD
              </Button>
              <Button
                onClick={() => {
                  disconnectWallet();
                  logout();
                }}
                variant="outline"
                className="terminal-border bg-transparent text-white hover:bg-white/5 font-mono"
              >
                LOGOUT
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              className="neon-border bg-transparent text-codi hover:bg-codi/10 font-mono"
            >
              {'>'}_LOGIN
            </Button>
          )}

          {/* Wallet Connection */}
          {user && (
            <Button
              onClick={connected ? handleWalletDisconnect : handleWalletConnect}
              disabled={walletLoading}
              className={`font-mono ${
                connected 
                  ? 'neon-border bg-transparent text-codi hover:bg-codi/10' 
                  : 'terminal-border bg-transparent text-white hover:bg-white/5'
              } disabled:opacity-50`}
            >
              {walletLoading ? (
                'PROCESSING...'
              ) : connected ? (
                'DISCONNECT_WALLET'
              ) : (
                '>_CONNECT_WALLET'
              )}
            </Button>
          )}

          {/* GitHub Connection */}
          {user && (
            <div className="relative group">
              <Button
                onClick={handleGitHubConnect}
                disabled={githubLoading}
                variant="outline"
                className={`terminal-border bg-transparent hover:bg-white/5 font-mono ${
                  state.githubConnected ? 'text-codi neon-border' : 'text-white'
                } disabled:opacity-50`}
              >
                {githubLoading ? (
                  'CONNECTING...'
                ) : state.githubConnected ? (
                  'GITHUB_CONNECTED'
                ) : (
                  'CONNECT_GITHUB'
                )}
                <span className="ml-2 text-xs bg-codi text-black px-1 py-0.5 rounded font-cyber">β</span>
              </Button>
              
              {/* Tooltip */}
              {!state.githubConnected && !githubLoading && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 glass-strong text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                  OAUTH_AUTHENTICATION_REQUIRED
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white/20"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button - simplified for now */}
        <div className="sm:hidden">
          {user ? (
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="terminal-border bg-transparent text-codi hover:bg-codi/10 font-mono text-xs px-2 py-1"
            >
              MENU
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              className="neon-border bg-transparent text-codi hover:bg-codi/10 font-mono text-xs px-2 py-1"
            >
              LOGIN
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
