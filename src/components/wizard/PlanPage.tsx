
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import AgentRunner from '../AgentRunner';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const PlanPage: React.FC = () => {
  const { state, updateProjectPlan, updateStep, completeStep } = useApp();

  const samplePrompts = [
    "Create a token swap platform with automated market making and liquidity pools",
    "Build a DeFi lending protocol with collateral management and interest rates",
    "Develop a token launchpad with vesting schedules and fair distribution"
  ];

  const handlePlanResult = (result: string) => {
    updateProjectPlan(result);
  };

  const handleNext = () => {
    if (state.projectPlan) {
      completeStep(1);
      updateStep(2);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Project <span className="text-codi text-glow">Planning</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Describe your Solana DApp vision, and our AI will create a comprehensive 
          development plan with architecture recommendations.
        </p>
      </div>

      <AgentRunner
        mode="plan"
        placeholder="Describe your Solana DApp idea in detail. Include features, target users, and any specific requirements..."
        onResult={handlePlanResult}
        samplePrompts={samplePrompts}
      />

      {state.projectPlan && (
        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-codi text-black hover:bg-codi/80 font-semibold px-8 py-3"
          >
            Continue to Scaffolding
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlanPage;
