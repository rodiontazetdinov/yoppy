"use client"

import { useState } from 'react';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, PawPrint, Star, ArrowRight } from 'lucide-react';
import { AddPetDialog } from '@/components/AddPetDialog';

export default function HomePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <MobileLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Логотип и заголовок */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
              <h1 className="text-4xl font-bold">Yoppy</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Делаем заботу о питомцах увлекательной
            </p>
          </div>

          {/* Карточки с преимуществами */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-2xl">
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-6">
                <PawPrint className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Умный помощник</h3>
                <p className="text-sm text-muted-foreground">
                  Персонализированные рекомендации по уходу за вашим питомцем
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-none">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-yellow-500 mb-4" />
                <h3 className="font-semibold mb-2">Достижения</h3>
                <p className="text-sm text-muted-foreground">
                  Получайте награды и опыт за заботу о питомце
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Кнопка добавления питомца */}
          <div className="space-y-4">
            <Button 
              size="lg"
              className="animate-bounce-slow"
              onClick={() => setIsDialogOpen(true)}
            >
              <Heart className="w-5 h-5 mr-2" />
              Начать заботиться
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Добавьте своего питомца и начните увлекательное путешествие
            </p>
          </div>

          {/* Диалог добавления питомца */}
          <AddPetDialog 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen} 
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </MobileLayout>
  );
}
