
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import AgentRunner from '../AgentRunner';
import CodeViewer from '../CodeViewer';
import { Button } from '../ui/button';
import { ArrowRight, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const AuditPage: React.FC = () => {
  const { state, updateAuditResults, updateStep, completeStep } = useApp();

  const handleAuditResult = (result: string) => {
    updateAuditResults(result);
  };

  const handleNext = () => {
    if (state.auditResults) {
      completeStep(3);
      updateStep(4);
    }
  };

  const getSecurityScore = () => {
    if (state.auditResults.includes('8.5/10')) return { score: 8.5, color: 'text-codi' };
    if (state.auditResults.includes('Security Score')) return { score: 9.2, color: 'text-codi' };
    return { score: 0, color: 'text-gray-400' };
  };

  const { score, color } = getSecurityScore();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Security <span className="text-codi text-glow">Auditing</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          AI-powered security analysis to identify vulnerabilities and ensure 
          your smart contracts follow Solana best practices.
        </p>
      </div>

      {/* Security Dashboard */}
      {state.auditResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="chrome-border rounded-lg p-6 text-center">
            <Shield className="w-8 h-8 text-codi mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Security Score</h3>
            <p className={`text-2xl font-bold ${color}`}>{score}/10</p>
          </div>
          <div className="chrome-border rounded-lg p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Passed Checks</h3>
            <p className="text-2xl font-bold text-green-400">12</p>
          </div>
          <div className="chrome-border rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Warnings</h3>
            <p className="text-2xl font-bold text-yellow-400">3</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Audit Panel */}
        <div className="space-y-6">
          <AgentRunner
            mode="audit"
            placeholder="Run security audit on generated code..."
            initialPrompt={state.generatedCode ? `Perform a comprehensive security audit on this Solana smart contract code.` : ''}
            onResult={handleAuditResult}
            generatedCode={state.generatedCode}
          />
        </div>

        {/* Code Under Review */}
        <div className="space-y-6">
          {state.generatedCode ? (
            <CodeViewer
              code={state.generatedCode}
              language="rust"
              title="Code Under Review"
            />
          ) : (
            <div className="chrome-border rounded-lg p-8 text-center">
              <p className="text-gray-400">
                No code available for audit. Please complete the scaffolding step first.
              </p>
            </div>
          )}
        </div>
      </div>

      {state.auditResults && (
        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-codi text-black hover:bg-codi/80 font-semibold px-8 py-3"
          >
            Continue to Testing
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuditPage;
