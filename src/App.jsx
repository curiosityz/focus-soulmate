import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Dashboard from './components/Dashboard';
import DataPipeline from './components/DataPipeline';
import ProjectManagement from './components/ProjectManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { toast } = useToast();

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleError = (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">ProjectMind</h1>
        {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} onError={handleError} />}
        {currentView === 'dataPipeline' && <DataPipeline onNavigate={handleNavigate} onError={handleError} />}
        {currentView === 'projectManagement' && <ProjectManagement onNavigate={handleNavigate} onError={handleError} />}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;