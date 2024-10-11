import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';

const ProjectManagement = ({ onNavigate }) => {
  const [task, setTask] = useState('');

  const planTaskMutation = useMutation({
    mutationFn: async (task) => {
      const response = await axios.post('http://localhost:8000/plan_task', { task });
      return response.data;
    },
  });

  const handlePlanTask = () => {
    planTaskMutation.mutate(task);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Project Management</h2>
      <Card>
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
      <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
    </div>
  );
};

export default ProjectManagement;