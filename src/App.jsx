import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from './components/Dashboard';
import DataPipeline from './components/DataPipeline';
import ProjectManagement from './components/ProjectManagement';

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">ProjectMind</h1>
        {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
        {currentView === 'dataPipeline' && <DataPipeline onNavigate={handleNavigate} />}
        {currentView === 'projectManagement' && <ProjectManagement onNavigate={handleNavigate} />}
      </div>
    </QueryClientProvider>
  );
};

export default App;