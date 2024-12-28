import { Heart, Coffee, Apple, Dumbbell } from 'lucide-react';

interface PetStatusProps {
  happiness: number;
  energy: number;
  hunger: number;
  health: number;
}

export function PetStatus({ happiness, energy, hunger, health }: PetStatusProps) {
  const getStatusColor = (value: number) => {
    if (value > 70) return 'text-green-500';
    if (value > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressBackground = (value: number) => {
    if (value > 70) return 'bg-green-200';
    if (value > 30) return 'bg-yellow-200';
    return 'bg-red-200';
  };

  const StatusBar = ({ value, icon, label }: { value: number; icon: React.ReactNode; label: string }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`w-full h-2 rounded-full ${getProgressBackground(value)}`}>
        <div
          className={`h-full rounded-full ${getStatusColor(value)} bg-current transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Состояние питомца</h3>
      <div className="grid gap-4">
        <StatusBar
          value={happiness}
          icon={<Heart className={`w-4 h-4 ${getStatusColor(happiness)}`} />}
          label="Счастье"
        />
        <StatusBar
          value={energy}
          icon={<Coffee className={`w-4 h-4 ${getStatusColor(energy)}`} />}
          label="Энергия"
        />
        <StatusBar
          value={hunger}
          icon={<Apple className={`w-4 h-4 ${getStatusColor(hunger)}`} />}
          label="Сытость"
        />
        <StatusBar
          value={health}
          icon={<Dumbbell className={`w-4 h-4 ${getStatusColor(health)}`} />}
          label="Здоровье"
        />
      </div>
    </div>
  );
} 