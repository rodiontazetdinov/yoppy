"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddPetForm } from '@/components/AddPetForm';
import { Heart } from 'lucide-react';

interface AddPetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPetDialog({ open, onOpenChange }: AddPetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-pink-500" />
            Добавить питомца
          </DialogTitle>
        </DialogHeader>
        <AddPetForm 
          isOpen={open} 
          onClose={() => onOpenChange(false)} 
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
} 