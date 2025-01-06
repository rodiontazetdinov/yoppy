'use client';

import { useState } from 'react';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Trophy, Star, Target } from 'lucide-react';

interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  petName: string;
  petType: string;
  content: string;
  type: 'achievement' | 'milestone' | 'activity' | 'care';
  timestamp: number;
  likes: number;
  comments: number;
  achievement?: {
    title: string;
    icon: string;
  };
  milestone?: {
    level: number;
    xp: number;
  };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Анна',
      petName: 'Барсик',
      petType: 'cat',
      content: 'Мой котик достиг нового уровня! Теперь он настоящий чемпион в уходе за собой 🏆',
      type: 'milestone',
      timestamp: Date.now() - 3600000,
      likes: 12,
      comments: 3,
      milestone: {
        level: 5,
        xp: 5000
      }
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Михаил',
      petName: 'Рекс',
      petType: 'dog',
      content: 'Сегодня мы выполнили все задания по уходу и получили достижение!',
      type: 'achievement',
      timestamp: Date.now() - 7200000,
      likes: 8,
      comments: 2,
      achievement: {
        title: 'Заботливый хозяин',
        icon: '🌟'
      }
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Елена',
      petName: 'Чижик',
      petType: 'bird',
      content: 'Наша первая тренировка прошла отлично! Чижик очень старался 🦜',
      type: 'activity',
      timestamp: Date.now() - 10800000,
      likes: 15,
      comments: 5
    }
  ]);

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'milestone': return <Star className="w-8 h-8 text-purple-500" />;
      case 'activity': return <Target className="w-8 h-8 text-blue-500" />;
      case 'care': return <Heart className="w-8 h-8 text-pink-500" />;
      default: return null;
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)} д. назад`;
    }
    if (hours > 0) {
      return `${hours} ч. назад`;
    }
    return `${minutes} мин. назад`;
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <MobileLayout>
      <div className="container p-4">
        <h1 className="text-2xl font-bold mb-6">Лента активности</h1>
        
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  {getPostIcon(post.type)}
                  <div>
                    <CardTitle className="text-base">
                      {post.userName} и {post.petName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(post.timestamp)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm mb-3">{post.content}</p>
                
                {post.achievement && (
                  <div className="bg-yellow-50 p-3 rounded-lg flex items-center gap-2">
                    <span className="text-2xl">{post.achievement.icon}</span>
                    <div>
                      <p className="font-medium text-sm">Новое достижение!</p>
                      <p className="text-sm text-muted-foreground">{post.achievement.title}</p>
                    </div>
                  </div>
                )}
                
                {post.milestone && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-500" />
                      <p className="font-medium text-sm">Уровень {post.milestone.level}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.milestone.xp} XP набрано
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-2">
                <div className="flex gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.comments}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
} 