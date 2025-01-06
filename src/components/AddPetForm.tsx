'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddPetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddPetForm({ isOpen, onClose, onSuccess }: AddPetFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [petInfo, setPetInfo] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    weight: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPetInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setPetInfo(prev => ({ ...prev, type: value }));
  };

  const handleStartCaring = async () => {
    try {
      console.log('Начинаем процесс добавления питомца:', petInfo);
      setIsLoading(true);
      
      const response = await fetch('/api/generate-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petInfo),
      });

      console.log('Ответ от сервера:', response.status);

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await response.json();
      console.log('Полученные данные:', data);
      
      // Загружаем существующих питомцев
      const savedPets = localStorage.getItem('pets');
      const pets = savedPets ? JSON.parse(savedPets) : [];
      
      // Создаем нового питомца
      const newPet = {
        id: Math.random().toString(36).substr(2, 9),
        ...petInfo,
        level: 1
      };
      
      // Добавляем нового питомца в список
      const updatedPets = [...pets, newPet];
      localStorage.setItem('pets', JSON.stringify(updatedPets));
      
      // Сохраняем данные питомца
      localStorage.setItem(`petCareData_${newPet.id}`, JSON.stringify({
        recommendations: data.recommendations,
        tasks: data.tasks
      }));
      
      // Устанавливаем текущего питомца
      localStorage.setItem('currentPetId', newPet.id);
      
      // Инициализируем статус питомца
      const initialStatus = {
        happiness: 100,
        energy: 100,
        hunger: 100,
        health: 100,
        lastUpdate: Date.now()
      };
      localStorage.setItem(`petStatus_${newPet.id}`, JSON.stringify(initialStatus));
      localStorage.setItem('petStatus', JSON.stringify(initialStatus));

      console.log('Данные сохранены в localStorage');

      // Закрываем диалог
      onClose();
      if (onSuccess) {
        onSuccess();
      }
      
      // Переходим на страницу задач
      router.push('/tasks');
    } catch (error) {
      console.error('Ошибка при добавлении питомца:', error);
      alert('Произошла ошибка при генерации рекомендаций. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить питомца</DialogTitle>
          <DialogDescription>
            Заполните информацию о вашем питомце, чтобы получить персонализированные рекомендации по уходу
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Кличка</Label>
            <Input
              id="name"
              name="name"
              value={petInfo.name}
              onChange={handleInputChange}
              placeholder="Введите кличку питомца"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Тип питомца</Label>
            <Select value={petInfo.type} onValueChange={handleTypeChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип питомца" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Собака</SelectItem>
                <SelectItem value="cat">Кошка</SelectItem>
                <SelectItem value="bird">Птица</SelectItem>
                <SelectItem value="other">Другое</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="breed">Порода</Label>
            <Input
              id="breed"
              name="breed"
              value={petInfo.breed}
              onChange={handleInputChange}
              placeholder="Введите породу питомца"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age">Возраст</Label>
            <Input
              id="age"
              name="age"
              value={petInfo.age}
              onChange={handleInputChange}
              placeholder="Введите возраст питомца"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">Вес</Label>
            <Input
              id="weight"
              name="weight"
              value={petInfo.weight}
              onChange={handleInputChange}
              placeholder="Введите вес питомца"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleStartCaring} disabled={isLoading || !petInfo.name || !petInfo.type}>
            {isLoading ? 'Загрузка...' : 'Начать заботиться'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 