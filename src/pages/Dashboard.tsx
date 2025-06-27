
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  wallet_address?: string;
  github_username?: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, projects, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_address, github_username, created_at')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-codi font-mono">LOADING_TERMINAL...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="glass-panel border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="prompt text-codi font-cyber text-xl">CODI v2.1.3</div>
            <div className="text-white/60 text-sm">
              USER: {user.email} | SESSION: ACTIVE
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="terminal-border bg-transparent text-white hover:bg-white/5"
            >
              {'>'}_NEW_PROJECT
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="terminal-border bg-transparent text-white hover:bg-white/5"
            >
              LOGOUT
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* User Info */}
        <div className="glass-panel rounded-lg p-6 mb-8 scan-lines relative">
          <h1 className="text-2xl font-cyber mb-4 cursor">
            TERMINAL_DASHBOARD
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-white/60">WALLET_ADDRESS:</div>
              <div className="font-code text-codi break-all">
                {profile?.wallet_address || 'NOT_CONNECTED'}
              </div>
            </div>
            <div>
              <div className="text-white/60">USER_ID:</div>
              <div className="font-code">{user.id}</div>
            </div>
            <div>
              <div className="text-white/60">JOINED:</div>
              <div className="font-code">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-cyber prompt">PROJECT_REGISTRY</h2>
            <div className="text-sm text-white/60">
              TOTAL: {projects.length} | DEPLOYED: {projects.filter(p => p.status === 'deployed').length}
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/40 mb-4 text-lg">NULL_PROJECTS_FOUND</div>
              <div className="text-white/60 text-sm mb-6">Initialize new project to begin development</div>
              <Button
                onClick={() => navigate('/')}
                className="neon-border bg-transparent text-codi hover:bg-codi/10"
              >
                {'>'}_INIT_NEW_PROJECT
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass-strong rounded-lg p-4 terminal-border hover:neon-border transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-cyber text-white">{project.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        project.status === 'deployed'
                          ? 'bg-codi/20 text-codi'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs text-white/60">
                    <div>
                      <span className="text-white/40">CREATED:</span> {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-white/40">MODIFIED:</span> {new Date(project.updated_at).toLocaleDateString()}
                    </div>
                    {project.program_id && (
                      <div>
                        <span className="text-white/40">PROGRAM_ID:</span>
                        <div className="font-code text-codi break-all">{project.program_id}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
