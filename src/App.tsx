import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PrescriptionAnalyzer } from './components/PrescriptionAnalyzer';
import { MedicineTimeline } from './components/MedicineTimeline';
import { LabReportAnalyzer } from './components/LabReportAnalyzer';
import { DrugInteractionChecker } from './components/DrugInteractionChecker';
import { AffordableAlternatives } from './components/AffordableAlternatives';
import { AIChatbot } from './components/AIChatbot';
import { HealthWallet } from './components/HealthWallet';
import { RemindersModule } from './components/RemindersModule';
import { MedicalDictionary } from './components/MedicalDictionary';
import { ProfileView } from './components/ProfileView';
import { EmergencyModeModal } from './components/EmergencyModeModal';
import { Toast } from './components/Toast';
import { AuthScreen } from './components/AuthScreen';

const MainLayout: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <AuthScreen />
        <Toast />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:from-[#060a12] dark:via-[#0b1220] dark:to-[#070d18] text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {activeTab !== 'home' && <Header />}

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'home' && <Dashboard />}
          {activeTab === 'prescriptions' && <PrescriptionAnalyzer />}
          {activeTab === 'lab-reports' && <LabReportAnalyzer />}
          {activeTab === 'medicines' && <MedicineTimeline />}
          {activeTab === 'interactions' && <DrugInteractionChecker />}
          {activeTab === 'alternatives' && <AffordableAlternatives />}
          {activeTab === 'health-wallet' && <HealthWallet />}
          {activeTab === 'reminders' && <RemindersModule />}
          {activeTab === 'ask-lumi' && <AIChatbot />}
          {activeTab === 'dictionary' && <MedicalDictionary />}
          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Emergency SOS Modal */}
      <EmergencyModeModal />

      {/* Toast Feedback */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
