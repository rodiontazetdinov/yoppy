'use client';

import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { Card } from '@/components/ui/card';
import { Medal, Star, Heart, Trophy, Target, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  maxProgress: number;
  reward: number;
  completed: boolean;
  color: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Заботливый хозяин',
      description: 'Выполните 50 задач по уходу',
      icon: Heart,
      progress: 0,
      maxProgress: 50,
      reward: 500,
      completed: false,
      color: 'text-pink-500'
    },
    {
      id: '2',
      title: 'Мастер тренировок',
      description: 'Проведите 30 тренировок',
      icon: Target,
      progress: 0,
      maxProgress: 30,
      reward: 300,
      completed: false,
      color: 'text-blue-500'
    },
    {
      id: '3',
      title: 'Лучший друг',
      description: 'Поддерживайте счастье питомца выше 80% в течение 7 дней',
      icon: Star,
      progress: 0,
      maxProgress: 7,
      reward: 1000,
      completed: false,
      color: 'text-yellow-500'
    },
    {
      id: '4',
      title: 'Чемпион',
      description: 'Достигните 10 уровня',
      icon: Trophy,
      progress: 1,
      maxProgress: 10,
      reward: 2000,
      completed: false,
      color: 'text-purple-500'
    },
    {
      id: '5',
      title: 'Питомец-спортсмен',
      description: 'Поддерживайте здоровье питомца на максимуме 5 дней подряд',
      icon: Crown,
      progress: 0,
      maxProgress: 5,
      reward: 800,
      completed: false,
      color: 'text-green-500'
    }
  ]);

  useEffect(() => {
    // Загружаем прогресс достижений
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }

    // Обновляем прогресс на основе данных о питомце
    const petStatus = localStorage.getItem('petStatus');
    const petCareData = localStorage.getItem('petCareData');
    
    if (petStatus && petCareData) {
      // Здесь можно добавить логику обновления прогресса
      // на основе статуса питомца и данных об уходе
    }
  }, []);

  return (
    <MobileLayout>
      <div className="container p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Достижения
        </h1>

        <div className="space-y-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

            return (
              <Card key={achievement.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${achievement.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Icon className={`w-6 h-6 ${achievement.completed ? achievement.color : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-yellow-600">
                          +{achievement.reward} XP
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${achievement.completed ? 'bg-green-500' : 'bg-primary'} transition-all`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {achievement.progress} / {achievement.maxProgress}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
} 