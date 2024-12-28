import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ShoppingBag, 
  Cookie, 
  Bone, 
  Syringe, 
  Stethoscope,
  CheckCircle2,
  Circle,
  Bell
} from 'lucide-react';

interface BasicTask {
  id: string;
  title: string;
  description: string;
  icon: any;
  type: 'document' | 'shopping' | 'health';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  repeat?: 'weekly' | 'monthly' | 'yearly';
}

export function BasicTasks() {
  const [tasks, setTasks] = useState<BasicTask[]>([
    {
      id: 'doc1',
      title: 'Ветеринарный паспорт',
      description: 'Прикрепите фото ветеринарного паспорта питомца',
      icon: FileText,
      type: 'document',
      priority: 'high',
      completed: false
    },
    {
      id: 'doc2',
      title: 'Медицинская карта',
      description: 'Добавьте информацию о прививках и лечении',
      icon: Stethoscope,
      type: 'document',
      priority: 'high',
      completed: false
    },
    {
      id: 'shop1',
      title: 'Купить корм',
      description: 'Основной корм заканчивается через 5 дней',
      icon: ShoppingBag,
      type: 'shopping',
      priority: 'high',
      completed: false,
      repeat: 'monthly'
    },
    {
      id: 'shop2',
      title: 'Вкусняшки',
      description: 'Купить любимые лакомства для питомца',
      icon: Cookie,
      type: 'shopping',
      priority: 'medium',
      completed: false,
      repeat: 'weekly'
    },
    {
      id: 'shop3',
      title: 'Новая игрушка',
      description: 'Порадуйте питомца новой игрушкой',
      icon: Bone,
      type: 'shopping',
      priority: 'low',
      completed: false,
      repeat: 'monthly'
    },
    {
      id: 'health1',
      title: 'Прививка',
      description: 'Плановая вакцинация через 2 недели',
      icon: Syringe,
      type: 'health',
      priority: 'high',
      completed: false,
      dueDate: '2024-02-01'
    }
  ]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.type]) {
      acc[task.type] = [];
    }
    acc[task.type].push(task);
    return acc;
  }, {} as Record<string, BasicTask[]>);

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'document': return 'Документы';
      case 'shopping': return 'Покупки';
      case 'health': return 'Здоровье';
      default: return type;
    }
  };

  const createReminder = (task: BasicTask) => {
    const savedReminders = localStorage.getItem('petReminders');
    const reminders = savedReminders ? JSON.parse(savedReminders) : [];
    
    const newReminder = {
      id: `reminder-${task.id}`,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority: task.priority,
      type: task.type,
      snoozed: false
    };
    
    const updatedReminders = [...reminders, newReminder];
    localStorage.setItem('petReminders', JSON.stringify(updatedReminders));
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([type, tasks]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="text-lg">{getTypeTitle(type)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => {
                const Icon = task.icon;
                const priorityColor = getPriorityColor(task.priority);
                
                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className={`p-2 rounded-full ${priorityColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{task.title}</h3>
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground">
                            Срок: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        {task.repeat && (
                          <p className="text-xs text-muted-foreground">
                            Повторять: {
                              task.repeat === 'weekly' ? 'еженедельно' :
                              task.repeat === 'monthly' ? 'ежемесячно' :
                              'ежегодно'
                            }
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            createReminder(task);
                          }}
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          Напомнить
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 