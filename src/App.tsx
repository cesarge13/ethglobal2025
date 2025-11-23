import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LotsManagement } from './components/LotsManagement';
import { RegisterLotWizard } from './components/RegisterLotWizard';
import { LotDetail } from './components/LotDetail';
import { Credits } from './components/Credits';
import { Payments } from './components/Payments';
import { AgroScore } from './components/AgroScore';
import { Activity } from './components/Activity';
import { Settings } from './components/Settings';
import { ThemeProvider } from './components/ThemeProvider';
import { FarmerDashboard } from './components/agricultural/FarmerDashboard';
import { EVVMMate } from './components/EVVMMate';
import { useAccount } from 'wagmi';

type Screen = 
  | 'dashboard' 
  | 'farmer-dashboard'
  | 'lots' 
  | 'register-lot'
  | 'lot-detail'
  | 'credits' 
  | 'agroscore'
  | 'payments' 
  | 'activity' 
  | 'evvm-mate'
  | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const handleViewLotDetail = (lotId: string) => {
    setSelectedLotId(lotId);
    setCurrentScreen('lot-detail');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} onViewLot={handleViewLotDetail} />;
      case 'farmer-dashboard':
        return <FarmerDashboard onNavigate={setCurrentScreen} />;
      case 'lots':
        return <LotsManagement onNavigate={setCurrentScreen} onViewLot={handleViewLotDetail} />;
      case 'register-lot':
        return <RegisterLotWizard onNavigate={setCurrentScreen} />;
      case 'lot-detail':
        return <LotDetail lotId={selectedLotId} onNavigate={setCurrentScreen} />;
      case 'credits':
        return <Credits onNavigate={setCurrentScreen} onViewLot={handleViewLotDetail} />;
      case 'agroscore':
        return <AgroScore onNavigate={setCurrentScreen} onViewLot={handleViewLotDetail} />;
      case 'payments':
        return <Payments onNavigate={setCurrentScreen} />;
      case 'activity':
        return <Activity onNavigate={setCurrentScreen} />;
      case 'evvm-mate':
        return <EVVMMate onNavigate={setCurrentScreen} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentScreen} onViewLot={handleViewLotDetail} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
        <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            isWalletConnected={isConnected}
            walletAddress={address || null}
          />
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {renderScreen()}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
