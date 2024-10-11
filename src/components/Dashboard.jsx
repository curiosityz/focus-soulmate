import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = ({ onNavigate }) => {
  // This is a placeholder for the actual dashboard data
  const objectives = [
    { id: 1, title: "Complete Project A", progress: 60, timeSpent: "3 days" },
    { id: 2, title: "Research Topic B", progress: 30, timeSpent: "1 day" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {objectives.map((objective) => (
        <Card key={objective.id}>
          <CardHeader>
            <CardTitle>{objective.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Progress: {objective.progress}%</p>
            <p>Time Spent: {objective.timeSpent}</p>
          </CardContent>
        </Card>
      ))}
      <Button onClick={() => onNavigate('dataPipeline')}>Open Data Pipeline</Button>
    </div>
  );
};

export default Dashboard;