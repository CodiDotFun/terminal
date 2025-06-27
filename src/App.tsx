
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import SolanaWalletProvider from "./components/SolanaWalletProvider";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import "./App.css";

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

import { SoundProvider } from './components/SoundManager';

const queryClient = new QueryClient();

function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <SolanaWalletProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AppProvider>
                <TooltipProvider>
                  <div className="min-h-screen bg-background text-foreground">
                    <Toaster />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </TooltipProvider>
              </AppProvider>
            </AuthProvider>
          </QueryClientProvider>
        </SolanaWalletProvider>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
