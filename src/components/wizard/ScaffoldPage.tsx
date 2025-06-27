
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import AgentRunner from '../AgentRunner';
import EnhancedCodeEditor from '../EnhancedCodeEditor';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const ScaffoldPage: React.FC = () => {
  const { state, updateGeneratedCode, updateStep, completeStep } = useApp();

  const handleCodeResult = (result: string) => {
    updateGeneratedCode(result);
  };

  const handleCodeChange = (code: string) => {
    updateGeneratedCode(code);
  };

  const handleNext = () => {
    if (state.generatedCode) {
      completeStep(2);
      updateStep(3);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Code <span className="text-codi text-glow">Scaffolding</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Generate your Anchor program structure and smart contract boilerplate 
          based on your project plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generation Panel */}
        <div className="space-y-6">
          <AgentRunner
            mode="scaffold"
            placeholder="Generate Anchor program code for my project..."
            initialPrompt={state.projectPlan ? `Generate the Anchor program structure and smart contracts for this project.` : ''}
            onResult={handleCodeResult}
            projectPlan={state.projectPlan}
          />
        </div>

        {/* Enhanced Code Editor */}
        <div className="space-y-6">
          {state.generatedCode ? (
            <EnhancedCodeEditor
              initialCode={state.generatedCode}
              language="rust"
              title="Generated Anchor Program"
              onCodeChange={handleCodeChange}
              onSave={(code) => {
                updateGeneratedCode(code);
                console.log('Code saved!');
              }}
              onRun={(code) => {
                console.log('Running code:', code);
              }}
            />
          ) : (
            <div className="chrome-border rounded-lg p-8 text-center">
              <p className="text-gray-400">
                Generated code will appear here after running the scaffolding agent.
              </p>
            </div>
          )}
        </div>
      </div>

      {state.generatedCode && (
        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-codi text-black hover:bg-codi/80 font-semibold px-8 py-3"
          >
            Continue to Auditing
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScaffoldPage;
