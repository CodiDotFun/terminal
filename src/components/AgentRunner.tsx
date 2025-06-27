
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AgentRunnerProps {
  mode: string;
  placeholder: string;
  initialPrompt?: string;
  onResult: (result: string) => void;
  samplePrompts?: string[];
  projectPlan?: string;
  generatedCode?: string;
}

const AgentRunner: React.FC<AgentRunnerProps> = ({
  mode,
  placeholder,
  initialPrompt = '',
  onResult,
  samplePrompts = [],
  projectPlan,
  generatedCode,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const runAgent = async () => {
    if (!prompt.trim()) return;

    setIsRunning(true);
    setError('');
    setResult('');

    try {
      console.log(`Running ${mode} agent with prompt:`, prompt.substring(0, 100) + '...');

      const { data, error: functionError } = await supabase.functions.invoke('ai-wizard', {
        body: {
          mode,
          prompt,
          projectPlan,
          generatedCode,
        },
      });

      if (functionError) {
        throw functionError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const aiResult = data.result;
      console.log(`${mode} agent completed successfully`);
      
      setResult(aiResult);
      onResult(aiResult);
      
    } catch (err: any) {
      console.error('Agent error:', err);
      setError(err.message || 'Failed to run agent. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const retry = () => {
    setError('');
    runAgent();
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="min-h-32 bg-gray-900/50 border-gray-600 text-white resize-none chrome-border"
          disabled={isRunning}
        />

        {/* Sample Prompts */}
        {samplePrompts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(sample)}
                  className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-md transition-colors"
                  disabled={isRunning}
                >
                  {sample.substring(0, 50)}...
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Run Button */}
        <Button
          onClick={runAgent}
          disabled={!prompt.trim() || isRunning}
          className="w-full bg-codi text-black hover:bg-codi/80 font-medium"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running CODI AI...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run CODI Agent
            </>
          )}
        </Button>
      </div>

      {/* Results Section */}
      {(result || error) && (
        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-600 rounded-lg">
              <p className="text-red-300 mb-2">{error}</p>
              <Button
                onClick={retry}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-300 hover:bg-red-600/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          )}

          {result && (
            <div className="chrome-border rounded-lg p-6 bg-gray-900/50">
              <h3 className="text-lg font-semibold text-codi mb-4">CODI Agent Output</h3>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {result}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentRunner;
