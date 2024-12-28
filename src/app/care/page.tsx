'use client';

import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { PetStatus } from '@/components/PetStatus';
import { Button } from '@/components/ui/button';
import { Apple, Coffee, Heart, Dumbbell, Bath, Bone } from 'lucide-react';
import { PetSelector } from '@/components/PetSelector';

interface PetStatus {
  happiness: number;
  energy: number;
  hunger: number;
  health: number;
  lastUpdate: number;
}

export default function CarePage() {
  const [petStatus, setPetStatus] = useState<PetStatus>({
    happiness: 100,
    energy: 100,
    hunger: 100,
    health: 100,
    lastUpdate: Date.now()
  });

  useEffect(() => {
    const savedStatus = localStorage.getItem('petStatus');
    if (savedStatus) {
      setPetStatus(JSON.parse(savedStatus));
    }
  }, []);

  const updateStatus = (updates: Partial<PetStatus>) => {
    setPetStatus(prev => {
      const newStatus = {
        ...prev,
        ...Object.entries(updates).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: Math.min(100, Math.max(0, prev[key as keyof PetStatus] + value))
        }), {}),
        lastUpdate: Date.now()
      };
      localStorage.setItem('petStatus', JSON.stringify(newStatus));
      return newStatus;
    });
  };

  const actions = [
    {
      label: 'Покормить',
      icon: Apple,
      color: 'bg-orange-100 text-orange-500 hover:bg-orange-200',
      onClick: () => updateStatus({ hunger: 30, energy: 10 })
    },
    {
      label: 'Поиграть',
      icon: Bone,
      color: 'bg-purple-100 text-purple-500 hover:bg-purple-200',
      onClick: () => updateStatus({ happiness: 25, energy: -15 })
    },
    {
      label: 'Отдохнуть',
      icon: Coffee,
      color: 'bg-blue-100 text-blue-500 hover:bg-blue-200',
      onClick: () => updateStatus({ energy: 40, health: 5 })
    },
    {
      label: 'Погладить',
      icon: Heart,
      color: 'bg-pink-100 text-pink-500 hover:bg-pink-200',
      onClick: () => updateStatus({ happiness: 15 })
    },
    {
      label: 'Помыть',
      icon: Bath,
      color: 'bg-cyan-100 text-cyan-500 hover:bg-cyan-200',
      onClick: () => updateStatus({ health: 20, happiness: -5 })
    },
    {
      label: 'Тренировка',
      icon: Dumbbell,
      color: 'bg-green-100 text-green-500 hover:bg-green-200',
      onClick: () => updateStatus({ health: 25, energy: -20, happiness: 10 })
    }
  ];

  return (
    <MobileLayout>
      <div className="container p-4">
        <div className="mb-6">
          <PetSelector />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Быстрые действия
        </h1>

        <div className="max-w-md mx-auto mb-8">
          <PetStatus
            happiness={petStatus.happiness}
            energy={petStatus.energy}
            hunger={petStatus.hunger}
            health={petStatus.health}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-2 ${action.color}`}
                onClick={action.onClick}
              >
                <Icon className="w-6 h-6" />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
} 