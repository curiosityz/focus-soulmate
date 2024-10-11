import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const fetchObjectives = async () => {
  const response = await axios.get('http://localhost:8000/get_objectives');
  return response.data.objectives;
};

const Dashboard = ({ onNavigate }) => {
  const { data: objectives, isLoading, error } = useQuery({
    queryKey: ['objectives'],
    queryFn: fetchObjectives,
  });

  if (isLoading) return <div>Loading objectives...</div>;
  if (error) return <div>Error fetching objectives: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {objectives.map((objective) => (
        <Card key={objective.id}>
          <CardHeader>
            <CardTitle>{objective.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={objective.progress} className="mb-2" />
            <p>Progress: {objective.progress}%</p>
            <p>Time Spent: {objective.time_spent}</p>
          </CardContent>
        </Card>
      ))}
      <Button onClick={() => onNavigate('dataPipeline')}>Open Data Pipeline</Button>
    </div>
  );
};

export default Dashboard;