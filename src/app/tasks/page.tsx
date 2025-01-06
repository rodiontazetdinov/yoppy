'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layouts/MobileLayout';

interface Task {
  id: string;
  title: string;
  description: string;
  frequency: string;
  duration: string;
  xp: number;
  completed: boolean;
  category: string;
}

export default function TasksPage() {
  const router = useRouter();
  const [petInfo, setPetInfo] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentPetId = localStorage.getItem('currentPetId');
    
    if (!currentPetId) {
      router.push('/pets');
      return;
    }

    // Загружаем данные из localStorage
    const savedPets = localStorage.getItem('pets');
    if (savedPets) {
      const pets = JSON.parse(savedPets);
      const currentPet = pets.find((pet: any) => pet.id === currentPetId);
      if (currentPet) {
        setPetInfo(currentPet);
      }
    }

    const petCareData = localStorage.getItem(`petCareData_${currentPetId}`);
    if (petCareData) {
      const { recommendations, tasks } = JSON.parse(petCareData);
      setRecommendations(recommendations);
      // Парсим текст задач в структурированный формат
      const parsedTasks = parseAITasks(tasks);
      setTasks(parsedTasks);
    }

    setIsLoading(false);
  }, [router]);

  // Функция для парсинга текста задач в структурированный формат
  const parseAITasks = (tasksText: string): Task[] => {
    const lines = tasksText.split('\n').filter(line => line.trim());
    const tasks: Task[] = [];
    let currentCategory = '';

    lines.forEach(line => {
      if (line.endsWith(':')) {
        currentCategory = line.slice(0, -1);
      } else if (line.match(/^\d+\./)) {
        try {
          // Формат: "1. Название (частота) - XP XP"
          const parts = line.split('-').map(s => s.trim());
          if (parts.length !== 2) {
            console.warn('Неверный формат строки задачи:', line);
            return;
          }

          const mainPart = parts[0]; // "1. Название (частота)"
          const xpPart = parts[1]; // "50 XP"

          // Извлекаем название и частоту
          const matches = mainPart.match(/^\d+\.\s+(.+?)\s+\((.+?)\)$/);
          if (!matches) {
            console.warn('Не удалось извлечь название и частоту:', mainPart);
            return;
          }

          const [, title, frequency] = matches;
          
          // Извлекаем число XP
          const xp = parseInt(xpPart);

          if (isNaN(xp)) {
            console.warn('Не удалось извлечь XP из строки:', xpPart);
            return;
          }

          tasks.push({
            id: Math.random().toString(36).substr(2, 9),
            title,
            description: '',
            frequency,
            duration: '',
            xp,
            completed: false,
            category: currentCategory
          });
        } catch (error) {
          console.error('Ошибка при парсинге строки задачи:', line, error);
        }
      }
    });

    return tasks;
  };

  const toggleTask = (taskId: string) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          // Если задача была не выполнена, добавляем XP
          if (!task.completed) {
            setTotalXP(prev => {
              const newXP = prev + task.xp;
              // Повышаем уровень каждые 1000 XP
              setLevel(Math.floor(newXP / 1000) + 1);
              return newXP;
            });
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return newTasks;
    });
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="container mx-auto py-6">
          <div>Загрузка...</div>
        </div>
      </MobileLayout>
    );
  }

  if (!petInfo) {
    return (
      <MobileLayout>
        <div className="container mx-auto py-6">
          <div>Питомец не найден</div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{petInfo.name}</h1>
            <p className="text-gray-500">Уровень {level} • {totalXP} XP</p>
          </div>
        </div>

        <Tabs defaultValue="tasks">
          <TabsList>
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <div className="grid gap-6 md:grid-cols-2">
              {['Кормление', 'Физическая активность', 'Гигиена', 'Здоровье'].map(category => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                    <CardDescription>
                      {tasks.filter(t => t.category === category && !t.completed).length} активных задач
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks
                        .filter(task => task.category === category)
                        .map(task => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleTask(task.id)}
                          >
                            <div>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-gray-500">{task.frequency}</div>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-4 text-sm font-medium text-green-600">
                                +{task.xp} XP
                              </span>
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => {}}
                                className="w-5 h-5"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Рекомендации по уходу</CardTitle>
                <CardDescription>
                  Персональные рекомендации для {petInfo.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {recommendations.split('\n\n').map((section, index) => (
                    <div key={index} className="mb-6">
                      {section.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
} 