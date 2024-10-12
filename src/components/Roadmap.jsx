import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fetchRoadmap = async () => {
  const response = await axios.get('http://localhost:8000/get_roadmap');
  return response.data.roadmap;
};

const Roadmap = ({ onError }) => {
  const { data: roadmap, isLoading, error } = useQuery({
    queryKey: ['roadmap'],
    queryFn: fetchRoadmap,
    onError,
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching roadmap: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Roadmap</h2>
      <Card>
        <CardHeader>
          <CardTitle>Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{roadmap}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Roadmap;
