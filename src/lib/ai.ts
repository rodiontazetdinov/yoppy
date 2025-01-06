const MISTRAL_API_KEY = 'H8JUDXVXijuuZ9CnF5xzKkWX8HHv4FK3';
const API_URL = 'https://api.mistral.ai/v1/chat/completions';

interface PetInfo {
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
}

async function callMistralAPI(prompt: string): Promise<string> {
  console.log('Отправляем запрос к Mistral API с промптом:', prompt);
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistral-tiny",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Ошибка от Mistral API:', errorText);
    throw new Error(`Failed to generate recommendations: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log('Получен ответ от Mistral API:', data);
  
  // Проверяем наличие ответа и извлекаем текст
  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content.trim();
  }
  
  throw new Error('Неверный формат ответа от Mistral API');
}

export async function generatePetRecommendations(petInfo: PetInfo): Promise<string> {
  const prompt = `Создай персонализированные рекомендации по уходу за питомцем на русском языке:
Имя: ${petInfo.name}
Тип: ${petInfo.type === 'dog' ? 'собака' : petInfo.type === 'cat' ? 'кошка' : petInfo.type === 'bird' ? 'птица' : 'питомец'}
Порода: ${petInfo.breed}
Возраст: ${petInfo.age}
Вес: ${petInfo.weight}

Рекомендации должны включать следующие разделы:
1. Питание и диета
2. Физическая активность
3. Гигиена
4. Здоровье

Пожалуйста, дай подробные, но понятные рекомендации, учитывающие все особенности питомца.`;

  return await callMistralAPI(prompt);
}

export async function generatePetTasks(petInfo: PetInfo): Promise<string> {
  const prompt = `Создай список ежедневных и еженедельных задач по уходу за питомцем на русском языке. 
ВАЖНО: Строго следуй формату ответа!

Для питомца:
Имя: ${petInfo.name}
Тип: ${petInfo.type === 'dog' ? 'собака' : petInfo.type === 'cat' ? 'кошка' : petInfo.type === 'bird' ? 'птица' : 'питомец'}
Порода: ${petInfo.breed}
Возраст: ${petInfo.age}
Вес: ${petInfo.weight}

Формат ответа ДОЛЖЕН быть таким (замени примеры своими задачами):

Кормление:
1. Утреннее кормление (ежедневно) - 50 XP
2. Вечернее кормление (ежедневно) - 50 XP

Физическая активность:
1. Утренняя прогулка (ежедневно) - 100 XP
2. Игры с мячом (еженедельно) - 200 XP

Гигиена:
1. Расчесывание шерсти (ежедневно) - 50 XP
2. Стрижка когтей (еженедельно) - 150 XP

Здоровье:
1. Прием витаминов (ежедневно) - 30 XP
2. Осмотр на наличие блох (еженедельно) - 100 XP

ВАЖНЫЕ ПРАВИЛА:
1. Каждая категория ДОЛЖНА быть отделена ПУСТОЙ строкой
2. Каждая задача ДОЛЖНА быть на новой строке и начинаться с номера
3. Формат задачи СТРОГО: "номер. Название (частота) - XP XP"
4. Частота может быть ТОЛЬКО: ежедневно, еженедельно или ежемесячно
5. XP должно быть числом от 20 до 500
6. Не добавляй никакого дополнительного текста до или после списка задач`;

  return await callMistralAPI(prompt);
} 