
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { ArrowRight, Zap, Shield, TestTube, Rocket } from 'lucide-react';

const InfoPage: React.FC = () => {
  const { updateStep, completeStep } = useApp();

  const handleNext = () => {
    completeStep(0);
    updateStep(1);
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-codi" />,
      title: "Multi-Agent Planning",
      description: "Distributed AI agents collaborate on project architecture and design"
    },
    {
      icon: <Shield className="w-8 h-8 text-codi" />,
      title: "Autonomous Security",
      description: "Intelligent vulnerability detection through agent-to-agent communication"
    },
    {
      icon: <TestTube className="w-8 h-8 text-codi" />,
      title: "Agent Orchestration",
      description: "Coordinated testing and validation across the multi-agent stack"
    },
    {
      icon: <Rocket className="w-8 h-8 text-codi" />,
      title: "Seamless Deployment",
      description: "Automated deployment pipeline managed by specialized agents"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">
            Welcome to <span className="text-codi text-glow">CODI</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience our multi-agent technology stack in action. The full CODI program operates autonomously 
            using MCP (Model Context Protocol) with A2A (Agent-to-Agent) communication. This terminal 
            demonstrates each step of our distributed AI system, giving you insight into how multiple 
            specialized agents collaborate to build secure Solana DApps.
          </p>
        </div>

        <div className="chrome-border rounded-2xl p-8 bg-gray-900/30 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-6">Multi-Agent Architecture</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Overview */}
      <div className="chrome-border rounded-xl p-6 bg-gray-900/30">
        <h3 className="text-xl font-semibold text-white mb-4">The CODI Agent Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-codi/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-codi font-bold">1-2</span>
            </div>
            <h4 className="font-semibold text-white">Analysis Agents</h4>
            <p className="text-sm text-gray-400 mt-1">Planning and architecture agents collaborate on project design</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-codi/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-codi font-bold">3-4</span>
            </div>
            <h4 className="font-semibold text-white">Development Agents</h4>
            <p className="text-sm text-gray-400 mt-1">Code generation and security audit agents work in parallel</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-codi/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-codi font-bold">5-6</span>
            </div>
            <h4 className="font-semibold text-white">Deployment Agents</h4>
            <p className="text-sm text-gray-400 mt-1">Testing and deployment agents ensure production readiness</p>
          </div>
        </div>
      </div>

      {/* Get Started */}
      <div className="text-center">
        <Button
          onClick={handleNext}
          size="lg"
          className="bg-codi text-black hover:bg-codi/80 font-semibold px-8 py-3 neon-glow"
        >
          Experience the Demo
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default InfoPage;
