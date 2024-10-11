import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ProjectManagement = ({ onNavigate }) => {
  const [task, setTask] = useState('');
  const [objective, setObjective] = useState('');
  const queryClient = useQueryClient();

  const { data: objectives, isLoading, error } = useQuery({
    queryKey: ['objectives'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/get_objectives');
      return response.data.objectives;
    },
  });

  const planTaskMutation = useMutation({
    mutationFn: async (task) => {
      const response = await axios.post('http://localhost:8000/plan_task', { task });
      return response.data;
    },
  });

  const addObjectiveMutation = useMutation({
    mutationFn: async (title) => {
      await axios.post('http://localhost:8000/add_objective', { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('objectives');
      setObjective('');
    },
  });

  const handlePlanTask = () => {
    planTaskMutation.mutate(task);
  };

  const handleAddObjective = () => {
    addObjectiveMutation.mutate(objective);
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
      <Card>
        <CardHeader>
          <CardTitle>Add Objective</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Enter a new objective"
            className="mb-2"
          />
          <Button onClick={handleAddObjective}>Add Objective</Button>
        </CardContent>
      </Card>
      {isLoading ? (
        <div>Loading objectives...</div>
      ) : error ? (
        <div>Error fetching objectives: {error.message}</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            {objectives.map((objective) => (
              <div key={objective.id} className="mb-2">
                <h3 className="font-semibold">{objective.title}</h3>
                <p>Progress: {objective.progress}%</p>
                <p>Time Spent: {objective.time_spent}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
    </div>
  );
};

export default ProjectManagement;