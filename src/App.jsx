import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Dashboard from './components/Dashboard';
import DataPipeline from './components/DataPipeline';
import ProjectManagement from './components/ProjectManagement';
import Summary from './components/Summary';
import Roadmap from './components/Roadmap';
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-3">
            <h1 className="text-3xl font-bold text-gray-800">ProjectMind</h1>
            <div className="mt-4 flex space-x-4">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => handleNavigate('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === 'dataPipeline' ? 'default' : 'outline'}
                onClick={() => handleNavigate('dataPipeline')}
              >
                Data Pipeline
              </Button>
              <Button
                variant={currentView === 'projectManagement' ? 'default' : 'outline'}
                onClick={() => handleNavigate('projectManagement')}
              >
                Project Management
              </Button>
              <Button
                variant={currentView === 'summary' ? 'default' : 'outline'}
                onClick={() => handleNavigate('summary')}
              >
                Daily Summary
              </Button>
              <Button
                variant={currentView === 'roadmap' ? 'default' : 'outline'}
                onClick={() => handleNavigate('roadmap')}
              >
                Roadmap
              </Button>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-6">
          {currentView === 'dashboard' && <Dashboard onError={handleError} />}
          {currentView === 'dataPipeline' && <DataPipeline onError={handleError} />}
          {currentView === 'projectManagement' && <ProjectManagement onError={handleError} />}
          {currentView === 'summary' && <Summary onError={handleError} />}
          {currentView === 'roadmap' && <Roadmap onError={handleError} />}
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
