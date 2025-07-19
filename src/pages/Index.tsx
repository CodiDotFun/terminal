
import React from 'react';
import { AppProvider } from '../contexts/AppContext';
import Header from '../components/Header';
import WizardStepper from '../components/WizardStepper';
import WizardLayout from '../components/WizardLayout';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col dark bg-black text-white">
        <Header />
        <WizardStepper />
        <main className="flex-1">
          <WizardLayout />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default Index;


//links aren't working please fix// Header on page 2 //
