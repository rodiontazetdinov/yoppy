"use client"

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, X } from 'lucide-react';
import { ActivityTimer } from './ActivityTimer';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    duration?: number;
    requiresPhoto?: boolean;
    requiresTimer?: boolean;
    xp: number;
    category?: string;
  };
  onComplete: (taskId: string, proof?: { photo?: string; duration?: number; distance?: number }) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const [photo, setPhoto] = useState<string | null>(null);

  // Обработка фото
  const handlePhotoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      const photoData = canvas.toDataURL('image/jpeg');
      setPhoto(photoData);

      // Останавливаем камеру
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Ошибка при съемке фото:', error);
    }
  };

  const handleActivityComplete = (activityData: any) => {
    onComplete(task.id, {
      duration: activityData.duration,
      distance: activityData.distance,
    });
  };

  const getActivityType = () => {
    if (task.category === 'Физическая активность') {
      if (task.title.toLowerCase().includes('прогулка')) {
        return 'walk';
      }
      if (task.title.toLowerCase().includes('игра')) {
        return 'play';
      }
      return 'training';
    }
    return 'training';
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{task.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

        <div className="space-y-4">
          {task.requiresPhoto && (
            <div className="flex flex-col items-center gap-2">
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="Подтверждение" className="rounded-lg max-w-full h-auto" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setPhoto(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={handlePhotoCapture} className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Сделать фото
                </Button>
              )}
            </div>
          )}

          {task.requiresTimer && (
            <ActivityTimer
              duration={task.duration || 10}
              onComplete={handleActivityComplete}
              activityType={getActivityType()}
            />
          )}

          {!task.requiresTimer && (
            <Button 
              onClick={() => onComplete(task.id, { photo })}
              className="w-full"
              disabled={task.requiresPhoto && !photo}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Завершить
            </Button>
          )}
        </div>

        <div className="absolute top-2 right-2 bg-primary/10 rounded-full px-2 py-1 text-xs">
          {task.xp} XP
        </div>
      </CardContent>
    </Card>
  );
} 