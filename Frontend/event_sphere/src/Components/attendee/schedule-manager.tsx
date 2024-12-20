import React, { useState } from "react"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/Toaster"

const schedule = [
  { id: 1, title: 'Opening Keynote', time: '9:00 AM - 10:00 AM', date: '2023-10-01', day: 'Day 1' },
  { id: 2, title: 'Panel Discussion: Future of AI', time: '11:00 AM - 12:00 PM', date: '2023-10-01', day: 'Day 1' },
  { id: 3, title: 'Workshop: Building Scalable Apps', time: '2:00 PM - 4:00 PM', date: '2023-10-02', day: 'Day 2' },
  { id: 4, title: 'Networking Event', time: '6:00 PM - 8:00 PM', date: '2023-10-02', day: 'Day 2' },
]

export function ScheduleManager() {
  const [bookmarkedSessions, setBookmarkedSessions] = useState<number[]>([])
  const { toast } = useToast();

  const toggleBookmark = (sessionId: number) => {
    setBookmarkedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    )

    const session = schedule.find(s => s.id === sessionId)
    if (session) {
      toast({
        title: bookmarkedSessions.includes(sessionId) ? "Session Unbookmarked" : "Session Bookmarked",
        description: `${session.title} on ${session.date} at ${session.time}`,
      })
    }
  }

  const groupedSchedule = schedule.reduce((acc, session) => {
    if (!acc[session.day]) {
      acc[session.day] = []
    }
    acc[session.day].push(session)
    return acc
  }, {})

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Event Schedule</CardTitle>
          <CardDescription>Browse and bookmark sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Day 1">
            <TabsList>
              {Object.keys(groupedSchedule).map(day => (
                <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(groupedSchedule).map(([day, sessions]: [string, any[]]) => (
              <TabsContent key={day} value={day}>
                {sessions.map(session => (
                  <div key={session.id} className="flex justify-between items-center mb-4 p-4 bg-secondary rounded-lg">
                    <div>
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">{session.time}</p>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                    </div>
                    <Button
                      variant={bookmarkedSessions.includes(session.id) ? "secondary" : "outline"}
                      onClick={() => toggleBookmark(session.id)}
                    >
                      {bookmarkedSessions.includes(session.id) ? 'Bookmarked' : 'Bookmark'}
                    </Button>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </>
  )
}

