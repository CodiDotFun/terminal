
import React from 'react';
import { useApp } from '../contexts/AppContext';

const WizardStepper: React.FC = () => {
  const { steps, state, updateStep } = useApp();

  if (state.chatMode) {
    return (
      <div className="glass-panel border-b border-white/10 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-codi font-cyber prompt cursor cyber-text">
              CHAT_MODE_ACTIVE | PLANNING_SESSION
            </div>
            <div className="text-xs text-white/40 mt-1 font-mono">
              Interactive AI consultation for project architecture
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel border-b border-white/10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Node */}
              <div
                className="flex items-center cursor-pointer transition-all duration-500 ease-out group"
                onClick={() => updateStep(index)}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded border-2 flex items-center justify-center transition-all duration-500 font-mono relative overflow-hidden ${
                      step.completed
                        ? 'bg-codi/20 border-codi text-codi neon-border'
                        : step.current
                        ? 'bg-codi/10 border-codi text-codi terminal-glow shadow-codi-glow'
                        : 'bg-transparent border-white/20 text-white/40 hover:border-codi/40 hover:text-codi/60 hover:bg-codi/5 hover:shadow-codi-glow'
                    }`}
                  >
                    {step.completed ? (
                      <span className="font-cyber relative z-10 animate-scale-in">✓</span>
                    ) : (
                      <span className={`font-cyber text-xs relative z-10 ${
                        step.current ? 'animate-text-glow' : ''
                      }`}>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-3 text-xs font-mono transition-all duration-500 ${
                      step.current 
                        ? 'text-codi cyber-text' 
                        : step.completed
                        ? 'text-white'
                        : 'text-white/40 group-hover:text-codi/60'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="relative flex-1 mx-4">
                  <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${
                        steps[index + 1].completed || state.currentStep > index
                          ? 'bg-gradient-to-r from-codi/60 to-codi/80 w-full shadow-connector-glow'
                          : step.current
                          ? 'bg-codi/40 w-1/3 animate-pulse-slow'
                          : 'bg-codi/20 w-0'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <div className="text-xs text-white/40 font-mono">
            STEP {state.currentStep + 1}/6 | DEVELOPMENT_PIPELINE | STATUS: 
            <span className="text-codi ml-1 cyber-text">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardStepper;
