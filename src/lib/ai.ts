const MISTRAL_API_KEY = 'H8JUDXVXijuuZ9CnF5xzKkWX8HHv4FK3';
const API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function generatePetRecommendations(petInfo: any) {
  const prompt = `Как опытный ветеринар, дайте подробные рекомендации по уходу за питомцем:
  
  Информация о питомце:
  - Тип: ${petInfo.type === 'dog' ? 'собака' : petInfo.type === 'cat' ? 'кошка' : petInfo.type === 'bird' ? 'птица' : 'другое животное'}
  - Кличка: ${petInfo.name}
  - Возраст: ${petInfo.age} лет
  - Вес: ${petInfo.weight}кг
  - Порода: ${petInfo.breed || 'не указана'}
  
  Пожалуйста, предоставьте конкретные рекомендации по следующим аспектам:
  1. Режим и рацион питания
  2. Физическая активность и упражнения
  3. Профилактика заболеваний и мониторинг здоровья
  4. Уход за шерстью/перьями и гигиена
  
  Дайте развернутые, но конкретные рекомендации, учитывающие особенности данного питомца.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [
          {
            role: 'system',
            content: 'Вы - опытный ветеринар и специалист по уходу за домашними животными. Давайте рекомендации на русском языке, используя профессиональные знания, но объясняя всё простым и понятным языком.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return 'К сожалению, не удалось сгенерировать рекомендации. Пожалуйста, попробуйте позже.';
  }
}

export async function generatePetTasks(petInfo: any) {
  const prompt = `Создайте список ежедневных и еженедельных задач по уходу за питомцем по кличке ${petInfo.name} (${petInfo.type === 'dog' ? 'собака' : petInfo.type === 'cat' ? 'кошка' : petInfo.type === 'bird' ? 'птица' : 'питомец'}, возраст: ${petInfo.age} лет).

  Создайте конкретные задачи для следующих категорий:
  1. Кормление и питьевой режим
  2. Физическая активность
  3. Гигиена и уход
  4. Здоровье и профилактика
  
  Для каждой задачи укажите:
  - Частоту выполнения (ежедневно/еженедельно)
  - Примерное время выполнения
  - Количество очков опыта (XP) за выполнение (от 10 до 100)
  
  Сделайте задачи конкретными, измеримыми и достижимыми.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [
          {
            role: 'system',
            content: 'Вы - эксперт по уходу за домашними животными, специализирующийся на создании планов ухода и геймификации. Создавайте задачи на русском языке, которые будут одновременно полезными и мотивирующими.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating tasks:', error);
    return 'К сожалению, не удалось сгенерировать задачи. Пожалуйста, попробуйте позже.';
  }
} 