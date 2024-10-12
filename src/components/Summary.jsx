import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fetchSummary = async () => {
  const response = await axios.get('http://localhost:8000/get_summary');
  return response.data.summary;
};

const Summary = ({ onError }) => {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary,
    onError,
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching summary: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Daily Summary</h2>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{summary}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
