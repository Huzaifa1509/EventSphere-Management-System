import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Session {
  _id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  floor: string;
  capacity: number;
  day: number;
  expo: any;
}

interface NotificationManagerProps {
  bookmarkedSessions: string[];
  schedule: Session[];
}

export function NotificationManager({ bookmarkedSessions, schedule }: NotificationManagerProps) {
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking for upcoming sessions every minute
    const interval = setInterval(() => {
      const now = new Date();
      const upcomingSessions = bookmarkedSessions
        .map(id => schedule.find(session => session._id === id))
        .filter(session => {
          if (!session) return false;
          const sessionTime = new Date(session.startTime);
          const timeDiff = sessionTime.getTime() - now.getTime();
          // Notify 15 minutes before the session
          return timeDiff > 0 && timeDiff <= 15 * 60 * 1000;
        });

      upcomingSessions.forEach(session => {
        if (session) {
          toast({
            title: "Upcoming Bookmarked Session",
            description: `${session.name} starts in 15 minutes!`,
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [bookmarkedSessions, schedule, toast]);

  return null; // This component doesn't render anything
}