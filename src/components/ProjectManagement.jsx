import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const ProjectManagement = ({ onError }) => {
  const [task, setTask] = useState('');
  const [objective, setObjective] = useState('');
  const queryClient = useQueryClient();

  const { data: objectives, isLoading, error } = useQuery({
    queryKey: ['objectives'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/get_objectives');
      return response.data.objectives;
    },
    onError,
  });

  const planTaskMutation = useMutation({
    mutationFn: async (task) => {
      const response = await axios.post('http://localhost:8000/plan_task', { task });
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Task Planned",
        description: data.plan,
      });
    },
    onError,
  });

  const addObjectiveMutation = useMutation({
    mutationFn: async (title) => {
      await axios.post('http://localhost:8000/add_objective', { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('objectives');
      setObjective('');
      toast({
        title: "Success",
        description: "Objective added successfully",
      });
    },
    onError,
  });

  const handlePlanTask = () => {
    planTaskMutation.mutate(task);
  };

  const handleAddObjective = () => {
    addObjectiveMutation.mutate(objective);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Project Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Plan Task</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task to plan"
            className="mb-4"
          />
          <Button onClick={handlePlanTask}>Plan Task</Button>
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
            className="mb-4"
          />
          <Button onClick={handleAddObjective}>Add Objective</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading objectives...</div>
          ) : error ? (
            <div className="text-red-500">Error fetching objectives: {error.message}</div>
          ) : (
            <ul className="space-y-4">
              {objectives.map((objective) => (
                <li key={objective.id} className="border-b pb-2">
                  <h3 className="font-semibold text-lg">{objective.title}</h3>
                  <p className="text-sm text-gray-600">Progress: {objective.progress}%</p>
                  <p className="text-sm text-gray-600">Time Spent: {objective.time_spent}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagement;