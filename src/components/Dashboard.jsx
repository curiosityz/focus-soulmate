import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const fetchObjectives = async () => {
  const response = await axios.get('http://localhost:8000/get_objectives');
  return response.data.objectives;
};

const Dashboard = ({ onError }) => {
  const { data: objectives, isLoading, error } = useQuery({
    queryKey: ['objectives'],
    queryFn: fetchObjectives,
    onError,
  });

  if (isLoading) return <div className="text-center">Loading objectives...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching objectives: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objectives.map((objective) => (
          <Card key={objective.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{objective.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={objective.progress} className="mb-2" />
              <p className="text-sm text-gray-600">Progress: {objective.progress}%</p>
              <p className="text-sm text-gray-600">Time Spent: {objective.time_spent}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;