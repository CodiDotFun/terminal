
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Shield, Database, Zap } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowEmailSent(false);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        setShowEmailSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showEmailSent) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="glass-panel rounded-lg p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <Mail className="w-16 h-16 text-codi mx-auto mb-4" />
            <h1 className="text-2xl font-cyber text-codi mb-2">
              CHECK_YOUR_EMAIL
            </h1>
            <p className="text-white/60 text-sm">
              We've sent a verification link to <span className="text-white">{email}</span>
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-white/5 border border-white/10 rounded p-4">
              <h3 className="text-white font-semibold mb-2">Next Steps:</h3>
              <ol className="text-white/60 text-xs space-y-1">
                <li>1. Check your email inbox</li>
                <li>2. Click the verification link</li>
                <li>3. You'll be redirected back to CODI</li>
                <li>4. Start building your Solana DApp!</li>
              </ol>
            </div>
            
            <p className="text-white/40 text-xs text-center">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
          </div>

          <Button
            onClick={() => {
              setShowEmailSent(false);
              setIsSignUp(false);
            }}
            variant="outline"
            className="w-full mt-6 terminal-border bg-transparent text-white hover:bg-white/5 font-mono"
          >
            BACK_TO_LOGIN
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
      <div className="glass-panel rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-cyber text-codi mb-2">
            {isSignUp ? 'CREATE_ACCOUNT' : 'LOGIN'}_TERMINAL
          </h1>
          <p className="text-white/60 text-sm">
            {isSignUp ? 'Join the CODI ecosystem' : 'Access your CODI workspace'}
          </p>
        </div>

        {/* Why Login Section */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded p-4">
          <h3 className="text-white font-semibold mb-3 text-sm">WHY_LOGIN_REQUIRED:</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-white/60">
              <Database className="w-3 h-3 text-codi" />
              <span>Save your projects and configurations</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Shield className="w-3 h-3 text-codi" />
              <span>Connect your wallet securely</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Zap className="w-3 h-3 text-codi" />
              <span>Access AI-powered development tools</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-white/60 text-xs mb-2">EMAIL_ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:border-codi focus:outline-none"
              placeholder="user@domain.com"
              required
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:border-codi focus:outline-none"
              placeholder="••••••••"
              required
            />
            {isSignUp && (
              <p className="text-white/40 text-xs mt-1">
                Minimum 6 characters required
              </p>
            )}
          </div>

          {isSignUp && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded px-3 py-2">
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="text-yellow-400 font-semibold">EMAIL_VERIFICATION_REQUIRED</p>
                  <p className="text-white/60 mt-1">
                    We'll send you a verification link to confirm your email address before you can start using CODI.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
              ERROR: {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full neon-border bg-transparent text-codi hover:bg-codi/10"
          >
            {loading ? 'PROCESSING...' : (isSignUp ? 'CREATE_ACCOUNT' : 'AUTHENTICATE')}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/60 hover:text-codi text-xs"
            >
              {isSignUp 
                ? 'Already have an account? LOGIN' 
                : 'Need an account? REGISTER'
              }
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            By continuing, you agree to CODI's terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

//missing dev manual override function codes
