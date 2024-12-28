export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'other';
  breed?: string;
  age: number;
  weight: number;
  healthStatus: 'healthy' | 'needs_attention' | 'sick';
  feedingSchedule: FeedingSchedule[];
  tasks: Task[];
  aiRecommendations: AiRecommendation[];
}

export interface FeedingSchedule {
  id: string;
  time: string;
  type: string;
  amount: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'feeding' | 'exercise' | 'health' | 'grooming';
  status: 'pending' | 'completed';
  dueDate: string;
  xpReward: number;
}

export interface AiRecommendation {
  id: string;
  category: 'health' | 'feeding' | 'exercise' | 'grooming';
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  pets: Pet[];
  experience: number;
  level: number;
} 