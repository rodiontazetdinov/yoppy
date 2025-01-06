"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Timer, MapPin, Bell, Star, Heart } from 'lucide-react';

export function ActivityGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Добро пожаловать в Yoppy!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm">
            <span className="font-semibold">Yoppy</span> - это не просто приложение для ухода за питомцами.
            Это ваш личный помощник, который делает заботу о питомце увлекательной и организованной.
          </p>
        </div>

        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4" />
            Фото-дневник
          </h3>
          <p className="text-sm text-muted-foreground">
            Создавайте фото-историю вашего питомца! Фотографии помогают:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
            <li>Отслеживать регулярность кормления</li>
            <li>Наблюдать за состоянием питомца</li>
            <li>Сохранять особые моменты</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4" />
            Умный таймер
          </h3>
          <p className="text-sm text-muted-foreground">
            Следите за активностями с умным таймером Yoppy:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
            <li>Отслеживание длительности прогулок и игр</li>
            <li>Удобные паузы для отдыха</li>
            <li>Рекомендации по оптимальному времени</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            Карта прогулок
          </h3>
          <p className="text-sm text-muted-foreground">
            Исследуйте мир вместе с Yoppy:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
            <li>Автоматическое измерение дистанции</li>
            <li>Красивая визуализация маршрутов</li>
            <li>История всех прогулок</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4" />
            Умные напоминания
          </h3>
          <p className="text-sm text-muted-foreground">
            Yoppy всегда напомнит о важном:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
            <li>Гибкие напоминания о задачах</li>
            <li>Возможность отложить уведомления</li>
            <li>Персонализированное расписание</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Достижения
          </h3>
          <p className="text-sm text-muted-foreground">
            Развивайтесь вместе:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
            <li>Получайте опыт за заботу</li>
            <li>Повышайте уровень</li>
            <li>Следите за показателями питомца</li>
          </ul>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium">Совет от Yoppy:</p>
          <p className="text-sm text-muted-foreground">
            Регулярная забота и внимание - ключ к счастью вашего питомца! 
            Выполняйте задачи, получайте достижения и наблюдайте, как улучшаются показатели здоровья и счастья.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 