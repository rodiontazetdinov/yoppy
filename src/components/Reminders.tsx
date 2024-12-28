"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  type: 'task' | 'shopping' | 'health';
  snoozed?: boolean;
  snoozedUntil?: number;
}

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Загружаем напоминания из localStorage
    const savedReminders = localStorage.getItem('petReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Фильтруем и сортируем напоминания
  const filteredReminders = reminders
    .filter(reminder => {
      if (reminder.snoozed && reminder.snoozedUntil) {
        return Date.now() >= reminder.snoozedUntil;
      }
      return true;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const visibleReminders = showAll ? filteredReminders : filteredReminders.slice(0, 3);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const formatDueDate = (date: string) => {
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return dueDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
      });
    }
  };

  const snoozeReminder = (id: string) => {
    setReminders(reminders.map(reminder => {
      if (reminder.id === id) {
        return {
          ...reminder,
          snoozed: true,
          snoozedUntil: Date.now() + 3600000 // Откладываем на 1 час
        };
      }
      return reminder;
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Напоминания
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-start gap-4 p-3 rounded-lg bg-accent/50"
            >
              <div className={`p-2 rounded-full ${getPriorityColor(reminder.priority)}`}>
                {reminder.type === 'task' && <Clock className="w-5 h-5" />}
                {reminder.type === 'shopping' && <Bell className="w-5 h-5" />}
                {reminder.type === 'health' && <Calendar className="w-5 h-5" />}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{reminder.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {reminder.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDueDate(reminder.dueDate)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => snoozeReminder(reminder.id)}
                    className="text-xs"
                  >
                    Отложить на час
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredReminders.length > 3 && (
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Показать меньше' : `Показать все (${filteredReminders.length})`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 