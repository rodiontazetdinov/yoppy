'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generatePetRecommendations, generatePetTasks } from '@/lib/ai';

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
      
      // Генерируем рекомендации и задачи напрямую через Mistral API
      const [recommendations, tasksText] = await Promise.all([
        generatePetRecommendations(petInfo),
        generatePetTasks(petInfo)
      ]);

      console.log('Сгенерированные рекомендации:', recommendations);
      console.log('Исходный текст задач:', tasksText);

      if (!tasksText || typeof tasksText !== 'string') {
        throw new Error('Неверный формат задач от API');
      }

      // Парсим задачи из текста
      const categories = tasksText.split('\n\n').filter(Boolean);
      console.log('Разделенные категории:', categories);

      const tasks = categories
        .filter(category => {
          const lines = category.split('\n').filter(Boolean);
          return lines.length >= 2; // Категория должна содержать название и хотя бы одну задачу
        })
        .flatMap(category => {
          const lines = category.split('\n').filter(Boolean);
          const categoryName = lines[0].replace(':', '').trim();
          console.log(`Обработка категории "${categoryName}" с ${lines.length} строками`);
          
          return lines.slice(1)
            .filter(line => {
              const isTask = line.trim().match(/^\d+\./);
              if (!isTask) {
                console.log('Пропущена строка, не соответствующая формату задачи:', line);
              }
              return isTask;
            })
            .map(line => {
              const match = line.match(/^\d+\.\s+(.+?)\s+\((.+?)\)\s+-\s+(\d+)\s+XP$/);
              if (match) {
                const task = {
                  id: Math.random().toString(36).substr(2, 9),
                  title: match[1].trim(),
                  frequency: match[2].trim(),
                  xp: parseInt(match[3]),
                  category: categoryName,
                  completed: false
                };
                console.log('Создана задача:', task);
                return task;
              }
              console.log('Не удалось распарсить строку задачи:', line);
              return null;
            })
            .filter(task => task !== null);
        });

      console.log('Распарсенные задачи:', tasks);
      
      if (tasks.length === 0) {
        throw new Error('Не удалось создать ни одной задачи из ответа API');
      }

      // Загружаем существующих питомцев
      const savedPets = localStorage.getItem('pets');
      const pets = savedPets ? JSON.parse(savedPets) : [];
      
      // Создаем нового питомца
      const newPet = {
        id: Math.random().toString(36).substr(2, 9),
        ...petInfo,
        level: 1
      };
      console.log('Создан новый питомец:', newPet);
      
      // Добавляем нового питомца в список
      const updatedPets = [...pets, newPet];
      localStorage.setItem('pets', JSON.stringify(updatedPets));
      
      // Сохраняем данные питомца
      const petCareData = {
        recommendations,
        tasks
      };
      console.log('Сохраняем данные питомца:', petCareData);
      localStorage.setItem(`petCareData_${newPet.id}`, JSON.stringify(petCareData));
      
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