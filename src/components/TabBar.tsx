import { Home, Heart, Award, PawPrint, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TabBar() {
  const pathname = usePathname();

  const tabs = [
    {
      label: 'Главная',
      icon: Home,
      href: '/tasks',
    },
    {
      label: 'Уход',
      icon: Heart,
      href: '/care',
    },
    {
      label: 'Лента',
      icon: Activity,
      href: '/feed',
    },
    {
      label: 'Питомцы',
      icon: PawPrint,
      href: '/pets',
    },
    {
      label: 'Достижения',
      icon: Award,
      href: '/achievements',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1
                ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
} 