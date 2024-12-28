import AddPetForm from '@/components/AddPetForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
              width="404"
              height="784"
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Navigation */}
            <nav className="relative flex items-center justify-between h-16 md:h-20">
              <div className="flex-shrink-0">
                <span className="text-2xl md:text-3xl font-bold text-indigo-600">🐾 PetCare AI</span>
              </div>
            </nav>

            {/* Hero content */}
            <div className="text-center py-12 md:py-20">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Умный помощник</span>
                <span className="block text-indigo-600">в уходе за питомцами</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Используйте силу искусственного интеллекта для создания персонализированного плана ухода за вашим питомцем.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left column */}
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Как это работает
              </h2>
              <div className="mt-6 space-y-6">
                {/* Steps */}
                <div className="relative">
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-indigo-200" />
                  <div className="space-y-8">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-indigo-600" />
                      <h3 className="text-lg font-medium text-gray-900">Добавьте питомца</h3>
                      <p className="mt-2 text-gray-500">
                        Укажите основную информацию о вашем питомце для создания персонального профиля
                      </p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-indigo-600" />
                      <h3 className="text-lg font-medium text-gray-900">Получите рекомендации</h3>
                      <p className="mt-2 text-gray-500">
                        AI проанализирует данные и создаст индивидуальный план ухода
                      </p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-indigo-600" />
                      <h3 className="text-lg font-medium text-gray-900">Следуйте плану</h3>
                      <p className="mt-2 text-gray-500">
                        Выполняйте задания, получайте награды и следите за прогрессом вашего питомца
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="mt-12 lg:mt-0 lg:col-span-7">
              <div className="lg:pl-8">
                <AddPetForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
