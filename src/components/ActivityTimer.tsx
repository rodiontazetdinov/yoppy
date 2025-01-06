"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Pause, Play, RotateCcw, MapPin } from 'lucide-react';
import { RouteMap } from './RouteMap';

interface ActivityTimerProps {
  duration: number; // минимальная длительность в минутах
  onComplete: (data: ActivityData) => void;
  activityType: 'walk' | 'play' | 'training';
}

interface ActivityData {
  duration: number; // фактическая длительность в секундах
  distance?: number; // пройденное расстояние в метрах
  route?: google.maps.LatLng[]; // маршрут прогулки
  pauseCount: number; // количество пауз
  startTime: string; // время начала
  endTime: string; // время окончания
}

export function ActivityTimer({ duration, onComplete, activityType }: ActivityTimerProps) {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [distance, setDistance] = useState(0);
  const [route, setRoute] = useState<google.maps.LatLng[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [lastPosition, setLastPosition] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const startActivity = () => {
    setIsActive(true);
    setStartTime(new Date().toISOString());

    if (activityType === 'walk') {
      // Начинаем отслеживать геолокацию
      if ('geolocation' in navigator) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            if (lastPosition) {
              // Рассчитываем пройденное расстояние
              const newDistance = calculateDistance(
                lastPosition.coords.latitude,
                lastPosition.coords.longitude,
                position.coords.latitude,
                position.coords.longitude
              );
              setDistance(prev => prev + newDistance);
              
              // Добавляем точку к маршруту
              setRoute(prev => [...prev, new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              )]);
            }
            setLastPosition(position);
          },
          (error) => console.error('Ошибка геолокации:', error),
          { enableHighAccuracy: true }
        );
        setWatchId(id);
      }
    }
  };

  const pauseActivity = () => {
    setIsPaused(true);
    setPauseCount(prev => prev + 1);
  };

  const resumeActivity = () => {
    setIsPaused(false);
  };

  const resetActivity = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
    setPauseCount(0);
    setStartTime(null);
    setDistance(0);
    setRoute([]);
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
  };

  const finishActivity = () => {
    const activityData: ActivityData = {
      duration: time,
      distance: activityType === 'walk' ? distance : undefined,
      route: activityType === 'walk' ? route : undefined,
      pauseCount,
      startTime: startTime!,
      endTime: new Date().toISOString()
    };

    onComplete(activityData);
    resetActivity();
  };

  // Функция для расчета расстояния между двумя точками
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // радиус Земли в метрах
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Форматирование расстояния
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} км`;
    }
    return `${Math.round(meters)} м`;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl font-mono font-bold">
            {formatTime(time)}
          </div>

          {activityType === 'walk' && (
            <>
              {distance > 0 && (
                <div className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  {formatDistance(distance)}
                </div>
              )}
              
              {route.length > 0 && (
                <RouteMap route={route} className="w-full" />
              )}
            </>
          )}

          <div className="flex items-center gap-2">
            {!isActive ? (
              <Button onClick={startActivity} className="w-32">
                <Play className="w-4 h-4 mr-2" />
                Старт
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button onClick={pauseActivity} variant="outline" className="w-32">
                    <Pause className="w-4 h-4 mr-2" />
                    Пауза
                  </Button>
                ) : (
                  <Button onClick={resumeActivity} variant="outline" className="w-32">
                    <Play className="w-4 h-4 mr-2" />
                    Продолжить
                  </Button>
                )}
                <Button onClick={resetActivity} variant="ghost" size="icon">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {isActive && time >= duration * 60 && (
            <Button 
              onClick={finishActivity}
              className="w-full"
              variant="default"
            >
              Завершить
            </Button>
          )}

          <div className="text-xs text-muted-foreground">
            {pauseCount > 0 && `Перерывов: ${pauseCount}`}
          </div>

          {duration > 0 && (
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${Math.min(100, (time / (duration * 60)) * 100)}%` }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 