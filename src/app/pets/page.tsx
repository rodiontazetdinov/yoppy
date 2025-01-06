'use client';

import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PetStatus } from '@/components/PetStatus';
import { Plus, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AddPetDialog } from '@/components/AddPetDialog';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  level: number;
}

interface PetData {
  pet: Pet;
  recommendations: string;
  tasks: string;
}

interface PetStatus {
  happiness: number;
  energy: number;
  hunger: number;
  health: number;
  lastUpdate: number;
}

export default function PetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string>('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [petStatuses, setPetStatuses] = useState<Record<string, PetStatus>>({});
  const [showAddPetDialog, setShowAddPetDialog] = useState(false);

  useEffect(() => {
    const savedPets = localStorage.getItem('pets');
    if (savedPets) {
      const parsedPets = JSON.parse(savedPets);
      setPets(parsedPets);

      // Загружаем статусы всех питомцев
      const statuses: Record<string, PetStatus> = {};
      parsedPets.forEach((pet: Pet) => {
        const status = localStorage.getItem(`petStatus_${pet.id}`);
        if (status) {
          statuses[pet.id] = JSON.parse(status);
        }
      });
      setPetStatuses(statuses);
    }
  }, []);

  const handlePetSelect = (petId: string) => {
    setSelectedPet(petId);
    localStorage.setItem('currentPetId', petId);
    
    // Загружаем данные выбранного питомца
    const petData = localStorage.getItem(`petCareData_${petId}`);
    if (petData) {
      localStorage.setItem('petCareData', petData);
    }
    
    const petStatus = localStorage.getItem(`petStatus_${petId}`);
    if (petStatus) {
      localStorage.setItem('petStatus', petStatus);
    }

    router.push('/tasks');
  };

  const showPetRecommendations = (petId: string) => {
    const petData = localStorage.getItem(`petCareData_${petId}`);
    if (petData) {
      const { recommendations } = JSON.parse(petData);
      setRecommendations(recommendations);
      setShowRecommendations(true);
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🦜';
      default: return '🐾';
    }
  };

  return (
    <MobileLayout>
      <div className="container p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Мои питомцы</h1>
          <Button onClick={() => setShowAddPetDialog(true)} size="icon" variant="outline">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid gap-4">
          {pets.map((pet) => (
            <Card key={pet.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTypeEmoji(pet.type)} {pet.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pet.breed || (
                        pet.type === 'dog' ? 'Собака' :
                        pet.type === 'cat' ? 'Кошка' :
                        pet.type === 'bird' ? 'Птица' : 'Питомец'
                      )}
                      {` • ${pet.age} лет • ${pet.weight} кг`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => showPetRecommendations(pet.id)}
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {petStatuses[pet.id] && (
                  <div className="mb-4">
                    <PetStatus {...petStatuses[pet.id]} />
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={() => handlePetSelect(pet.id)}
                >
                  Выбрать питомца
                </Button>
              </CardContent>
            </Card>
          ))}

          {pets.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                У вас пока нет питомцев
              </p>
              <Button onClick={() => setShowAddPetDialog(true)}>
                Добавить питомца
              </Button>
            </Card>
          )}
        </div>

        <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Рекомендации AI</DialogTitle>
            </DialogHeader>
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              <div className="prose prose-sm">
                <div className="whitespace-pre-wrap">
                  {recommendations}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AddPetDialog 
          open={showAddPetDialog} 
          onOpenChange={setShowAddPetDialog} 
        />
      </div>
    </MobileLayout>
  );
} 