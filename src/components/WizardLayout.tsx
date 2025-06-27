
import React from 'react';
import { useApp } from '../contexts/AppContext';
import ChatMode from './ChatMode';
import InfoPage from './wizard/InfoPage';
import PlanPage from './wizard/PlanPage';
import ScaffoldPage from './wizard/ScaffoldPage';
import AuditPage from './wizard/AuditPage';
import TestPage from './wizard/TestPage';
import DeployPage from './wizard/DeployPage';

const WizardLayout: React.FC = () => {
  const { state } = useApp();

  const renderCurrentPage = () => {
    if (state.chatMode) {
      return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-200px)]">
          <ChatMode />
        </div>
      );
    }

    switch (state.currentStep) {
      case 0:
        return <InfoPage />;
      case 1:
        return <PlanPage />;
      case 2:
        return <ScaffoldPage />;
      case 3:
        return <AuditPage />;
      case 4:
        return <TestPage />;
      case 5:
        return <DeployPage />;
      default:
        return <InfoPage />;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Sophisticated floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-codi/20 rounded-full float-animation"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-codi/30 rounded-full float-animation"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-codi/15 rounded-full float-animation"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-codi/25 rounded-full float-animation"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default WizardLayout;
