import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  level: number;
}

export function PetSelector() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);

  useEffect(() => {
    // Загружаем список питомцев
    const savedPets = localStorage.getItem('pets');
    if (savedPets) {
      const parsedPets = JSON.parse(savedPets);
      setPets(parsedPets);
      
      // Устанавливаем текущего питомца
      const currentPetId = localStorage.getItem('currentPetId');
      if (currentPetId) {
        const index = parsedPets.findIndex((pet: Pet) => pet.id === currentPetId);
        if (index !== -1) {
          setCurrentPetIndex(index);
        }
      }
    }
  }, []);

  const switchPet = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentPetIndex + 1) % pets.length
      : (currentPetIndex - 1 + pets.length) % pets.length;
    
    setCurrentPetIndex(newIndex);
    localStorage.setItem('currentPetId', pets[newIndex].id);
    
    // Загружаем данные выбранного питомца
    const petData = localStorage.getItem(`petCareData_${pets[newIndex].id}`);
    if (petData) {
      localStorage.setItem('petCareData', petData);
    }
    
    const petStatus = localStorage.getItem(`petStatus_${pets[newIndex].id}`);
    if (petStatus) {
      localStorage.setItem('petStatus', petStatus);
    }
    
    // Обновляем страницу для загрузки данных нового питомца
    window.location.reload();
  };

  const addNewPet = () => {
    router.push('/');
  };

  if (pets.length === 0) {
    return (
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={addNewPet}
      >
        <Plus className="w-4 h-4" />
        Добавить питомца
      </Button>
    );
  }

  const currentPet = pets[currentPetIndex];

  return (
    <div className="flex items-center justify-between gap-4 bg-white rounded-lg p-3 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => switchPet('prev')}
        disabled={pets.length <= 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="flex-1 text-center">
        <h2 className="font-semibold">{currentPet.name}</h2>
        <p className="text-sm text-muted-foreground">
          {currentPet.type === 'dog' ? 'Собака' :
           currentPet.type === 'cat' ? 'Кошка' :
           currentPet.type === 'bird' ? 'Птица' : 'Питомец'}
          {currentPet.breed && ` • ${currentPet.breed}`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => switchPet('next')}
          disabled={pets.length <= 1}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={addNewPet}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
} 