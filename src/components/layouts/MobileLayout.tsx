import { TabBar } from '../TabBar';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {children}
      </main>
      <TabBar />
    </div>
  );
} 