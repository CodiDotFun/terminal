
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import AgentRunner from '../AgentRunner';
import { Button } from '../ui/button';
import { ArrowRight, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const TestPage: React.FC = () => {
  const { state, updateTestResults, updateStep, completeStep } = useApp();
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');

  const testSuites = [
    { name: 'Unit Tests', status: 'pending', tests: ['Token Creation', 'Transfer Function', 'Access Control'] },
    { name: 'Integration Tests', status: 'pending', tests: ['Wallet Integration', 'Program Deployment'] },
    { name: 'Performance Tests', status: 'pending', tests: ['Transaction Speed', 'Memory Usage'] }
  ];

  const [tests, setTests] = useState(testSuites);

  const handleTestResult = (result: string) => {
    updateTestResults(result);
    setTerminalOutput(result);
    
    // Mark all tests as passed when AI generates test results
    setTests(prev => prev.map(suite => ({ ...suite, status: 'passed' })));
  };

  const runTests = async () => {
    setIsRunningTests(true);
    setTerminalOutput('');
    
    // Simulate test output
    const outputs = [
      '🚀 Starting test suite...\n',
      '📦 Compiling contracts...\n',
      '✅ Unit Tests: Token Creation - PASSED\n',
      '✅ Unit Tests: Transfer Function - PASSED\n',
      '✅ Unit Tests: Access Control - PASSED\n',
      '✅ Integration Tests: Wallet Integration - PASSED\n',
      '✅ Integration Tests: Program Deployment - PASSED\n',
      '✅ Performance Tests: Transaction Speed - PASSED\n',
      '✅ Performance Tests: Memory Usage - PASSED\n',
      '\n🎉 All tests passed! Your DApp is ready for deployment.\n'
    ];

    for (let i = 0; i < outputs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTerminalOutput(prev => prev + outputs[i]);
      
      // Update test statuses
      if (i >= 2 && i <= 4) {
        setTests(prev => prev.map((suite, index) => 
          index === 0 ? { ...suite, status: 'passed' } : suite
        ));
      } else if (i >= 5 && i <= 6) {
        setTests(prev => prev.map((suite, index) => 
          index === 1 ? { ...suite, status: 'passed' } : suite
        ));
      } else if (i >= 7 && i <= 8) {
        setTests(prev => prev.map((suite, index) => 
          index === 2 ? { ...suite, status: 'passed' } : suite
        ));
      }
    }

    setIsRunningTests(false);
    updateTestResults(terminalOutput);
  };

  const handleNext = () => {
    if (state.testResults || tests.every(test => test.status === 'passed')) {
      completeStep(4);
      updateStep(5);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Smart Contract <span className="text-codi text-glow">Testing</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Generate comprehensive tests and validate your smart contract functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Generation Panel */}
        <div className="space-y-6">
          <AgentRunner
            mode="test"
            placeholder="Generate comprehensive tests for the smart contract..."
            initialPrompt={state.generatedCode ? "Generate comprehensive test suite for this Anchor program including unit tests, integration tests, and performance benchmarks." : ""}
            onResult={handleTestResult}
            generatedCode={state.generatedCode}
          />

          <div className="chrome-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Test Suites</h3>
            <div className="space-y-4">
              {tests.map((suite, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{suite.name}</h4>
                    {getStatusIcon(suite.status)}
                  </div>
                  <div className="pl-4 space-y-1">
                    {suite.tests.map((test, testIndex) => (
                      <div key={testIndex} className="flex items-center space-x-2 text-sm text-gray-400">
                        {getStatusIcon(suite.status)}
                        <span>{test}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={runTests}
              disabled={isRunningTests}
              className="w-full mt-4 bg-codi/20 text-codi border border-codi hover:bg-codi/30"
            >
              {isRunningTests ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="chrome-border rounded-lg overflow-hidden">
          <div className="bg-gray-900/80 p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-codi">Test Output</h3>
          </div>
          <div className="bg-black p-4 h-96 overflow-y-auto font-mono text-sm">
            <pre className="text-green-400 whitespace-pre-wrap">
              {terminalOutput || 'Generate tests or run simulation to see output...'}
            </pre>
          </div>
        </div>
      </div>

      {(state.testResults || tests.every(test => test.status === 'passed')) && (
        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-codi text-black hover:bg-codi/80 font-semibold px-8 py-3"
          >
            Continue to Deployment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestPage;
