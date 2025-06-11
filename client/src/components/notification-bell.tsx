import { useState } from "react";
import { Bell, MessageCircle, Heart, Share2, Trophy, Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: number;
  type: 'new_story' | 'like' | 'share' | 'challenge' | 'trending';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'new_story',
    title: 'New Hot Story Alert!',
    message: 'The College Scandal just dropped and it\'s already going viral!',
    time: '2m ago',
    unread: true,
    actionUrl: '/chat/4'
  },
  {
    id: 2,
    type: 'trending',
    title: 'Story Going Viral!',
    message: 'Your favorite "Secret Crush Revealed" just hit 1M views!',
    time: '15m ago',
    unread: true
  },
  {
    id: 3,
    type: 'challenge',
    title: 'Challenge Progress',
    message: 'You\'re 80% done with the Share the Drama Challenge! Keep going!',
    time: '1h ago',
    unread: false
  },
  {
    id: 4,
    type: 'like',
    title: 'Popular Story',
    message: 'A story you liked just got 50K new hearts!',
    time: '2h ago',
    unread: false
  }
];

function getNotificationIcon(type: string) {
  switch (type) {
    case 'new_story':
      return <MessageCircle className="h-4 w-4 text-blue-400" />;
    case 'like':
      return <Heart className="h-4 w-4 text-red-400" />;
    case 'share':
      return <Share2 className="h-4 w-4 text-green-400" />;
    case 'challenge':
      return <Trophy className="h-4 w-4 text-yellow-400" />;
    case 'trending':
      return <Flame className="h-4 w-4 text-orange-400" />;
    default:
      return <Bell className="h-4 w-4 text-gray-400" />;
  }
}

export default function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="p-2 text-gray-400 hover:text-white transition-colors relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <Card className="bg-[var(--card-bg)] border-gray-700 w-80 max-h-96 overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">Notifications</h4>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-400 hover:text-blue-300 p-1"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-gray-400 hover:text-white"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-900/20 border-l-2 border-l-blue-400' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white truncate">
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-400 ml-2">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}