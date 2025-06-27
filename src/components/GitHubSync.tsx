
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { toast } from 'sonner';

const GitHubSync: React.FC = () => {
  const { state } = useApp();
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // Check for GitHub OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('github') === 'connected') {
      toast.success('GitHub connected successfully!');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const createRepository = async () => {
    if (!user || !state.githubConnected) {
      toast.error('Please connect GitHub first');
      return;
    }

    setCreating(true);
    try {
      toast.loading('Creating GitHub repository...', { id: 'repo-create' });
      
      const projectName = `codi-project-${Date.now()}`;
      
      const { data, error } = await supabase.functions.invoke('github-integration', {
        body: {
          action: 'create-repo',
          repoName: projectName,
          description: 'CODI Terminal Project - AI-Generated Solana DApp'
        }
      });

      if (error) {
        console.error('Repository creation error:', error);
        toast.error('Failed to create repository: ' + (error.message || 'Unknown error'), { id: 'repo-create' });
        return;
      }

      if (data?.success) {
        toast.success(`Repository created: ${projectName}`, { id: 'repo-create' });
        toast.success(`View at: ${data.repoUrl}`, { duration: 10000 });
        console.log('GITHUB_REPOSITORY_CREATED:', data);
      } else {
        toast.error('Failed to create GitHub repository', { id: 'repo-create' });
      }
    } catch (error) {
      console.error('Repository creation failed:', error);
      toast.error('Repository creation failed: ' + (error instanceof Error ? error.message : 'Unknown error'), { id: 'repo-create' });
    } finally {
      setCreating(false);
    }
  };

  if (!state.githubConnected) {
    return null;
  }

  return (
    <div className="mt-4">
      <Button
        onClick={createRepository}
        disabled={creating}
        className="neon-border bg-transparent text-codi hover:bg-codi/10 font-mono"
      >
        {creating ? 'CREATING_REPO...' : 'CREATE_REPOSITORY'}
      </Button>
    </div>
  );
};

export default GitHubSync;
