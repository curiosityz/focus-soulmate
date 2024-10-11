import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectMind />
    </QueryClientProvider>
  );
};

const ProjectMind = () => {
  const [inputText, setInputText] = useState('');
  const [query, setQuery] = useState('');
  const [task, setTask] = useState('');

  const { data: documents, refetch: refetchDocuments } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/get_documents');
      return response.data.documents;
    },
  });

  const addDocumentMutation = useMutation({
    mutationFn: async (text) => {
      await axios.post('http://localhost:8000/add_document', { text });
    },
    onSuccess: () => {
      refetchDocuments();
      setInputText('');
    },
  });

  const queryMutation = useMutation({
    mutationFn: async (query) => {
      const response = await axios.post('http://localhost:8000/query', { query });
      return response.data;
    },
  });

  const synthesizeMutation = useMutation({
    mutationFn: async (query) => {
      const response = await axios.post('http://localhost:8000/synthesize', { query });
      return response.data;
    },
  });

  const planTaskMutation = useMutation({
    mutationFn: async (task) => {
      const response = await axios.post('http://localhost:8000/plan_task', { task });
      return response.data;
    },
  });

  const handleAddDocument = () => {
    addDocumentMutation.mutate(inputText);
  };

  const handleQuery = () => {
    queryMutation.mutate(query);
  };

  const handleSynthesize = () => {
    synthesizeMutation.mutate(query);
  };

  const handlePlanTask = () => {
    planTaskMutation.mutate(task);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ProjectMind</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add to Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to add to knowledge base"
            className="mb-2"
          />
          <Button onClick={handleAddDocument}>Add Document</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Query Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query"
            className="mb-2"
          />
          <Button onClick={handleQuery} className="mr-2">Query</Button>
          <Button onClick={handleSynthesize}>Synthesize</Button>
          {queryMutation.data && (
            <div className="mt-2">
              <h3 className="font-semibold">Answer:</h3>
              <p>{queryMutation.data.answer}</p>
              <h3 className="font-semibold mt-2">Context:</h3>
              <p>{queryMutation.data.context}</p>
            </div>
          )}
          {synthesizeMutation.data && (
            <div className="mt-2">
              <h3 className="font-semibold">Synthesis:</h3>
              <p>{synthesizeMutation.data.synthesis}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Plan Task</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task to plan"
            className="mb-2"
          />
          <Button onClick={handlePlanTask}>Plan Task</Button>
          {planTaskMutation.data && (
            <div className="mt-2">
              <h3 className="font-semibold">Task Plan:</h3>
              <p>{planTaskMutation.data.plan}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          {documents && documents.map((doc, index) => (
            <Card key={doc.id} className="mb-2">
              <CardContent>
                <p>{doc.content}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;