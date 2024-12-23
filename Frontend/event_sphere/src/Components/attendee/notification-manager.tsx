import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/Components/ui/Toaster';

export function NotificationManager({ bookmarkedSessions, schedule }) {
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking for upcoming sessions every minute
    const interval = setInterval(() => {
      const now = new Date();
      const upcomingSessions = bookmarkedSessions
        .map(id => schedule.find(session => session.id === id))
        .filter(session => {
          if (!session) return false;
          const sessionTime = new Date(session.date + ' ' + session.time.split(' - ')[0]);
          const timeDiff = sessionTime.getTime() - now.getTime();
          // Notify 15 minutes before the session
          return timeDiff > 0 && timeDiff <= 15 * 60 * 1000;
        });

      upcomingSessions.forEach(session => {
        console.log(`Upcoming Bookmarked Session: ${session.title} starts in 15 minutes!`);
        toast({
          title: "Upcoming Bookmarked Session",
          description: `${session.title} starts in 15 minutes!`,
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [bookmarkedSessions, schedule, toast]);

  return null; // This component doesn't render anything
}