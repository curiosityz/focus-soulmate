import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const DataPipeline = ({ onError }) => {
  const [inputText, setInputText] = useState('');
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/get_documents');
      return response.data.documents;
    },
    onError,
  });

  const addDocumentMutation = useMutation({
    mutationFn: async (text) => {
      await axios.post('http://localhost:8000/add_document', { text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('documents');
      setInputText('');
      toast({
        title: "Success",
        description: "Document added successfully",
      });
    },
    onError,
  });

  const handleAddDocument = () => {
    addDocumentMutation.mutate(inputText);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Pipeline</h2>
      <Card>
        <CardHeader>
          <CardTitle>Add to Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to add to knowledge base"
            className="mb-4"
          />
          <Button onClick={handleAddDocument}>Add Document</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading documents...</div>
          ) : error ? (
            <div className="text-red-500">Error fetching documents: {error.message}</div>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {documents.map((doc, index) => (
                <li key={index} className="text-gray-700">{doc.content}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPipeline;