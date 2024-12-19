import React from "react"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export function EventInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Information</CardTitle>
        <CardDescription>Details about the upcoming event</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2"><strong>Date:</strong> October 1-3, 2023</p>
        <p className="mb-2"><strong>Location:</strong> Convention Center, City</p>
        <p className="mb-2"><strong>Description:</strong> Join us for an exciting event featuring the latest innovations in technology.</p>
        <Button className="mt-4">View Full Schedule</Button>
      </CardContent>
      <CardFooter>
        <Button>Register Now</Button>
      </CardFooter>
    </Card>
  )
}
