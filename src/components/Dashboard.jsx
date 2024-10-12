import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const fetchObjectives = async () => {
  const response = await axios.get('http://localhost:8000/get_objectives');
  return response.data.objectives;
};

const fetchSummary = async () => {
  const response = await axios.get('http://localhost:8000/get_summary');
  return response.data.summary;
};

const fetchRoadmap = async () => {
  const response = await axios.get('http://localhost:8000/get_roadmap');
  return response.data.roadmap;
};

const Dashboard = ({ onError }) => {
  const { data: objectives, isLoading: isLoadingObjectives, error: objectivesError } = useQuery({
    queryKey: ['objectives'],
    queryFn: fetchObjectives,
    onError,
  });

  const { data: summary, isLoading: isLoadingSummary, error: summaryError } = useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary,
    onError,
  });

  const { data: roadmap, isLoading: isLoadingRoadmap, error: roadmapError } = useQuery({
    queryKey: ['roadmap'],
    queryFn: fetchRoadmap,
    onError,
  });

  if (isLoadingObjectives || isLoadingSummary || isLoadingRoadmap) return <div className="text-center">Loading...</div>;
  if (objectivesError || summaryError || roadmapError) return <div className="text-center text-red-500">Error fetching data: {objectivesError?.message || summaryError?.message || roadmapError?.message}</div>;

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
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Daily Summary</h3>
        <Card className="mt-4">
          <CardContent>
            <p className="text-gray-700">{summary}</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Roadmap</h3>
        <Card className="mt-4">
          <CardContent>
            <p className="text-gray-700">{roadmap}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
