'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PetStatus } from '@/components/PetStatus';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { PetSelector } from '@/components/PetSelector';
import { BasicTasks } from '@/components/BasicTasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Reminders } from '@/components/Reminders';

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

interface PetData {
  pet: {
    name: string;
    type: string;
    breed: string;
    age: string;
    weight: string;
  };
  recommendations: string;
  tasks: string;
}

interface PetStatus {
  happiness: number;
  energy: number;
  hunger: number;
  health: number;
  lastUpdate: number;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [petData, setPetData] = useState<PetData | null>(null);
  const [petStatus, setPetStatus] = useState<PetStatus>({
    happiness: 100,
    energy: 100,
    hunger: 100,
    health: 100,
    lastUpdate: Date.now()
  });

  useEffect(() => {
    // Загружаем данные из localStorage
    const savedData = localStorage.getItem('petCareData');
    if (!savedData) {
      router.push('/');
      return;
    }

    const data: PetData = JSON.parse(savedData);
    setPetData(data);

    // Загружаем сохраненный статус питомца
    const savedStatus = localStorage.getItem('petStatus');
    if (savedStatus) {
      setPetStatus(JSON.parse(savedStatus));
    }

    const parsedTasks = parseAITasks(data.tasks);
    setTasks(parsedTasks);

    // Запускаем таймер для обновления состояния
    const timer = setInterval(updatePetStatus, 60000); // Обновляем каждую минуту
    return () => clearInterval(timer);
  }, []);

  // Функция обновления состояния питомца
  const updatePetStatus = () => {
    setPetStatus(prevStatus => {
      const timePassed = (Date.now() - prevStatus.lastUpdate) / (1000 * 60); // минуты
      
      // Рассчитываем новые значения
      const newHunger = Math.max(0, prevStatus.hunger - timePassed * 0.5);
      const newEnergy = Math.max(0, prevStatus.energy - timePassed * 0.3);
      const newHappiness = Math.max(0, prevStatus.happiness - timePassed * 0.2);
      const newHealth = Math.max(0, prevStatus.health - timePassed * 0.1);

      const newStatus = {
        happiness: newHappiness,
        energy: newEnergy,
        hunger: newHunger,
        health: newHealth,
        lastUpdate: Date.now()
      };

      // Сохраняем новый статус
      localStorage.setItem('petStatus', JSON.stringify(newStatus));
      return newStatus;
    });
  };

  // Функция для парсинга текста задач от AI в структурированный формат
  const parseAITasks = (tasksText: string): Task[] => {
    // Простой парсер для демонстрации
    // В реальном приложении нужно будет написать более сложную логику парсинга
    const lines = tasksText.split('\n');
    const parsedTasks: Task[] = [];
    let currentCategory = 'Кормление';
    
    lines.forEach((line, index) => {
      if (line.includes('Кормление')) currentCategory = 'Кормление';
      else if (line.includes('Физическая активность')) currentCategory = 'Физическая активность';
      else if (line.includes('Гигиена')) currentCategory = 'Гигиена';
      else if (line.includes('Здоровье')) currentCategory = 'Здоровье';
      
      if (line.includes('XP')) {
        const task: Task = {
          id: `task-${index}`,
          title: line.split('.')[1]?.trim() || 'Задача',
          description: line,
          frequency: line.includes('ежедневно') ? 'Ежедневно' : 'Еженедельно',
          duration: '10-15 минут',
          xp: parseInt(line.match(/\d+\s*XP/)?.[0] || '50'),
          completed: false,
          category: currentCategory
        };
        parsedTasks.push(task);
      }
    });

    return parsedTasks;
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (!task.completed) {
          // Обновляем статус питомца при выполнении задачи
          setPetStatus(prev => {
            const newStatus = {
              happiness: Math.min(100, prev.happiness + 10),
              energy: Math.min(100, prev.energy + 5),
              hunger: Math.min(100, prev.hunger + 15),
              health: Math.min(100, prev.health + 8),
              lastUpdate: Date.now()
            };
            localStorage.setItem('petStatus', JSON.stringify(newStatus));
            return newStatus;
          });

          setTotalXP(prev => {
            const newXP = prev + task.xp;
            if (newXP >= level * 1000) {
              setLevel(prev => prev + 1);
            }
            return newXP;
          });
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const categories = ['Кормление', 'Физическая активность', 'Гигиена', 'Здоровье'];

  if (!petData) {
    return <div className="container mx-auto p-4 text-center">Загрузка...</div>;
  }

  return (
    <MobileLayout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <PetSelector />
        </div>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Уход за питомцем {petData.pet.name}
          </h1>
          <p className="text-muted-foreground mb-4">
            {petData.pet.type === 'dog' ? 'Собака' : 
             petData.pet.type === 'cat' ? 'Кошка' : 
             petData.pet.type === 'bird' ? 'Птица' : 'Питомец'} 
            {petData.pet.breed && ` • ${petData.pet.breed}`}
          </p>
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-lg font-semibold">Уровень: {level}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-lg font-semibold">Опыт: {totalXP} XP</p>
            </div>
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <PetStatus
              happiness={petStatus.happiness}
              energy={petStatus.energy}
              hunger={petStatus.hunger}
              health={petStatus.health}
            />
          </div>

          <div className="max-w-md mx-auto mb-8">
            <Reminders />
          </div>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="daily">Ежедневные задачи</TabsTrigger>
            <TabsTrigger value="basic">Базовые задачи</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(category => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks
                        .filter(task => task.category === category)
                        .map(task => (
                          <div
                            key={task.id}
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent cursor-pointer"
                            onClick={() => toggleTask(task.id)}
                          >
                            {task.completed ? (
                              <CheckCircle className="w-6 h-6 text-primary mt-1" />
                            ) : (
                              <Circle className="w-6 h-6 mt-1" />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                                <span>{task.frequency}</span>
                                <span>•</span>
                                <span>{task.duration}</span>
                                <span>•</span>
                                <span>{task.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="basic">
            <BasicTasks />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
} 