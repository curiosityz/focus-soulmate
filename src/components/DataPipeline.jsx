import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DataPipeline = ({ onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
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
      {isLoading ? (
        <div>Loading documents...</div>
      ) : error ? (
        <div>Error fetching documents: {error.message}</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.map((doc) => (
              <p key={doc.id}>{doc.content}</p>
            ))}
          </CardContent>
        </Card>
      )}
      <Button onClick={() => onNavigate('projectManagement')}>Open Project Management</Button>
    </div>
  );
};

export default DataPipeline;