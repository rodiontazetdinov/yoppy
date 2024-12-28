'use client';

interface PetRecommendationsProps {
  recommendations: string;
  tasks: string;
  onClose: () => void;
}

export default function PetRecommendations({ recommendations, tasks, onClose }: PetRecommendationsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Рекомендации AI</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 space-y-6">
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

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Закрыть
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Начать заботиться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 