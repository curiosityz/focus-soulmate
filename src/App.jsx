import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const queryClient = new QueryClient();

const App = () => {
  const [inputText, setInputText] = useState('');
  const [documents, setDocuments] = useState([]);

  const addDocument = async () => {
    try {
      await axios.post('http://localhost:8000/add_document', { text: inputText });
      setInputText('');
      fetchDocuments();
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_documents');
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">ProjectMind</h1>
        <div className="mb-4">
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to add to knowledge base"
            className="mr-2"
          />
          <Button onClick={addDocument}>Add Document</Button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Knowledge Base</h2>
          {documents.map((doc, index) => (
            <Card key={index} className="mb-2">
              <CardHeader>
                <CardTitle>Document {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{doc.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;