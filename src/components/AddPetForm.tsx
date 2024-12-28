'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generatePetRecommendations, generatePetTasks } from '@/lib/ai';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  level: number;
}

export default function AddPetForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [tasks, setTasks] = useState<string | null>(null);
  const [petInfo, setPetInfo] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    weight: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recommendationsResult = await generatePetRecommendations(petInfo);
      const tasksResult = await generatePetTasks(petInfo);

      setRecommendations(recommendationsResult);
      setTasks(tasksResult);
      setShowDialog(true);
    } catch (error) {
      console.error('Error adding pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPetInfo({
      name: '',
      type: 'dog',
      breed: '',
      age: '',
      weight: ''
    });
    setRecommendations(null);
    setTasks(null);
    setShowDialog(false);
  };

  const handleStartCaring = () => {
    // Создаем уникальный ID для нового питомца
    const petId = Date.now().toString();
    
    // Создаем объект питомца
    const newPet: Pet = {
      id: petId,
      ...petInfo,
      level: 1
    };

    // Загружаем существующих питомцев
    const savedPets = localStorage.getItem('pets');
    const pets = savedPets ? JSON.parse(savedPets) : [];
    
    // Добавляем нового питомца
    pets.push(newPet);
    localStorage.setItem('pets', JSON.stringify(pets));
    
    // Устанавливаем нового питомца как текущего
    localStorage.setItem('currentPetId', petId);

    // Сохраняем данные питомца
    const petData = {
      pet: petInfo,
      recommendations,
      tasks
    };
    
    localStorage.setItem(`petCareData_${petId}`, JSON.stringify(petData));
    localStorage.setItem('petCareData', JSON.stringify(petData));
    
    // Создаем начальный статус для нового питомца
    const initialStatus = {
      happiness: 100,
      energy: 100,
      hunger: 100,
      health: 100,
      lastUpdate: Date.now()
    };
    
    localStorage.setItem(`petStatus_${petId}`, JSON.stringify(initialStatus));
    localStorage.setItem('petStatus', JSON.stringify(initialStatus));
    
    setShowDialog(false);
    router.push('/tasks');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Добавить питомца</CardTitle>
          <CardDescription>
            Заполните информацию о вашем питомце, и AI поможет составить план ухода
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Имя питомца</Label>
              <Input
                id="name"
                value={petInfo.name}
                onChange={(e) => setPetInfo({ ...petInfo, name: e.target.value })}
                required
                placeholder="Например: Барсик"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Тип питомца</Label>
              <Select
                value={petInfo.type}
                onValueChange={(value) => setPetInfo({ ...petInfo, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип питомца" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Собака 🐕</SelectItem>
                  <SelectItem value="cat">Кошка 🐱</SelectItem>
                  <SelectItem value="bird">Птица 🦜</SelectItem>
                  <SelectItem value="other">Другое 🐾</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Порода</Label>
              <Input
                id="breed"
                value={petInfo.breed}
                onChange={(e) => setPetInfo({ ...petInfo, breed: e.target.value })}
                placeholder="Необязательно"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Возраст (лет)</Label>
                <Input
                  id="age"
                  type="number"
                  value={petInfo.age}
                  onChange={(e) => setPetInfo({ ...petInfo, age: e.target.value })}
                  required
                  min="0"
                  step="0.1"
                  placeholder="1.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Вес (кг)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={petInfo.weight}
                  onChange={(e) => setPetInfo({ ...petInfo, weight: e.target.value })}
                  required
                  min="0"
                  step="0.1"
                  placeholder="4.5"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Анализируем...
              </>
            ) : (
              'Добавить питомца'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Рекомендации AI</DialogTitle>
            <DialogDescription>
              Персональный план ухода для {petInfo.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                Персональные рекомендации
              </h3>
              <div className="prose prose-indigo">
                <div className="whitespace-pre-wrap text-gray-700">
                  {recommendations}
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                Задачи по уходу
              </h3>
              <div className="prose prose-emerald">
                <div className="whitespace-pre-wrap text-gray-700">
                  {tasks}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={resetForm}>
              Добавить ещё
            </Button>
            <Button onClick={handleStartCaring}>
              Начать заботиться
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 