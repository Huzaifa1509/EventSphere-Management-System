import React, { useState } from 'react'	
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const exhibitors = [
  { id: 1, name: 'Tech Corp', category: 'Software', booth: 'A1' },
  { id: 2, name: 'Innovate Inc', category: 'Hardware', booth: 'B2' },
  { id: 3, name: 'AI Solutions', category: 'Artificial Intelligence', booth: 'C3' },
]

export function ExhibitorSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExhibitor, setSelectedExhibitor] = useState(null)

  const filteredExhibitors = exhibitors.filter(exhibitor =>
    exhibitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exhibitor.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exhibitor Search</CardTitle>
        <CardDescription>Find exhibitors and their booth locations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search exhibitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setSearchTerm('')}>Clear</Button>
        </div>
        <div className="space-y-2">
          {filteredExhibitors.map(exhibitor => (
            <div key={exhibitor.id} className="flex justify-between items-center p-2 bg-secondary rounded-lg">
              <div>
                <h3 className="font-semibold">{exhibitor.name}</h3>
                <p className="text-sm text-muted-foreground">{exhibitor.category}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedExhibitor(exhibitor)}>View Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedExhibitor?.name}</DialogTitle>
                    <DialogDescription>Exhibitor Details</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p><strong>Category:</strong> {selectedExhibitor?.category}</p>
                    <p><strong>Booth:</strong> {selectedExhibitor?.booth}</p>
                    <p className="mt-4">Contact the exhibitor for more information or to schedule a meeting.</p>
                  </div>
                  <Button className="w-full">Contact Exhibitor</Button>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

