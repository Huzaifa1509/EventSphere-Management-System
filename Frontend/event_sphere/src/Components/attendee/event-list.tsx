import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const events = [
  {
    id: 1,
    title: 'Tech Expo 2023',
    date: 'October 1-3, 2023',
    location: 'Convention Center, City',
    description: 'Join us for an exciting event featuring the latest innovations in technology.',
  },
  {
    id: 2,
    title: 'AI Summit',
    date: 'November 15-17, 2023',
    location: 'Tech Hub, Silicon Valley',
    description: 'Explore the future of Artificial Intelligence and its impact on various industries.',
  },
  {
    id: 3,
    title: 'Startup Showcase',
    date: 'December 5-7, 2023',
    location: 'Innovation Center, New York',
    description: 'Discover groundbreaking ideas from the most promising startups in the tech industry.',
  },
]

interface EventListProps {
  limit?: number;
}

export function EventList({ limit }: EventListProps) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const displayedEvents = limit ? events.slice(0, limit) : events

  return (
    <div className="pb-4">
      {displayedEvents.map((event) => (
        <Card key={event.id} className="mb-4">
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.date} | {event.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{event.description}</p>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedEvent(event)}>Register</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Register for {selectedEvent?.title}</DialogTitle>
                  <DialogDescription>
                    Enter your details to register for the event.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Confirm Registration</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

