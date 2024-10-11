import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';

const DataPipeline = ({ onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const queryClient = useQueryClient();

  const addDocumentMutation = useMutation({
    mutationFn: async (text) => {
      await axios.post('http://localhost:8000/add_document', { text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('documents');
      setInputText('');
    },
  });

  const handleAddDocument = () => {
    addDocumentMutation.mutate(inputText);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Data Pipeline</h2>
      <Card>
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
      <Button onClick={() => onNavigate('projectManagement')}>Open Project Management</Button>
    </div>
  );
};

export default DataPipeline;