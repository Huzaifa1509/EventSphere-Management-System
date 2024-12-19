import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/Dialog"; // Shadcn Dialog Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit } from "lucide-react"; // Icons for delete and edit
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/Components/ui/Toaster';import { Input } from "@/components/ui/Input"; // Input for the form
import { Calendar } from "@/components/ui/Calendar"; // Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"; // Popover component

interface ExpoEvents {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  organizerName: string;
  organizerContact: string;
  totalBooths: number;
}

const ShowAllExpos: React.FC = () => {
  const [expos, setExpos] = useState<ExpoEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedExpo, setSelectedExpo] = useState<ExpoEvents | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const response = await axios.get("/api/expos");
        setExpos(response.data);
      } catch (error) {
        console.error("Error fetching expos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpos();
  }, []);

  // Handle delete action
  const handleDelete = async (expoId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/expos/${expoId}`);
        setExpos(expos.filter((expo) => expo._id !== expoId));
        toast({
          variant: "default",
          title: "Success",
          description: "Event deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete event",
        });
      }
    }
  };

  // Handle opening the dialog to edit the expo details
  const openEditDialog = (expo: ExpoEvents) => {
    setSelectedExpo({
      ...expo,
      startDate: new Date(expo.startDate), // Ensure it's a Date object
      endDate: new Date(expo.endDate),     // Ensure it's a Date object
    });
    setOpenDialog(true);
  };

  // Handle closing the dialog
  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedExpo(null);
  };

  const handleSaveChanges = async () => {
    if (selectedExpo) {
      try {
        const updatedExpo = {
          ...selectedExpo,
          startDate: selectedExpo.startDate.toISOString().split("T")[0], // Format date as string
          endDate: selectedExpo.endDate.toISOString().split("T")[0],     // Format date as string
        };
        console.log(updatedExpo);
        console.log(selectedExpo._id);
        await axios.put(`/api/expos/${selectedExpo._id}`, updatedExpo);
        setExpos(expos.map(expo => expo._id === selectedExpo._id ? updatedExpo : expo)); // Update local state
        closeDialog();
        toast({
          variant: "default",
          title: "Success",
          description: "Event updated successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update event",
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">All Events</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {expos.map((expo) => (
            <Card key={expo._id} className="shadow-lg rounded-lg bg-slate-900 text-white">
              <CardHeader className="relative">
                {/* Edit icon at top left */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-4 p-2" // Add padding here
                  onClick={() => openEditDialog(expo)}
                >
                  <Edit className="h-5 w-5 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 p-2"
                  onClick={() => handleDelete(expo._id)}
                >
                  <Trash2 className="h-5 w-5 text-white" />
                </Button>

                <CardTitle className="text-lg font-semibold ">{expo.name}</CardTitle>
                <CardDescription>{expo.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm">
                  <span className="font-semibold">Venue:</span> {expo.venue}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Organizer Name:</span>{" "}
                  {expo.organizerName}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Organizer Contact:</span>{" "}
                  {expo.organizerContact}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Total Booths:</span>{" "}
                  {expo.totalBooths}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm border-t border-slate-700 pt-2">
                <span>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {new Date(expo.startDate).toLocaleDateString()}
                </span>
                <span>
                  <span className="font-semibold">End Date:</span>{" "}
                  {new Date(expo.endDate).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update the event details below</DialogDescription>
          {selectedExpo && (
            <div className="space-y-4">
              <Input
                value={selectedExpo.name}
                onChange={(e) => setSelectedExpo({ ...selectedExpo, name: e.target.value })}
                placeholder="Event Name"
              />
              <Input
                value={selectedExpo.description}
                onChange={(e) => setSelectedExpo({ ...selectedExpo, description: e.target.value })}
                placeholder="Description"
              />
              <Input
                value={selectedExpo.venue}
                onChange={(e) => setSelectedExpo({ ...selectedExpo, venue: e.target.value })}
                placeholder="Venue"
              />
              <div>
                <span className="font-semibold">Start Date:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="w-full text-left">
                      {selectedExpo.startDate.toLocaleDateString()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      selected={selectedExpo.startDate}
                      onSelect={(date) => setSelectedExpo({ ...selectedExpo, startDate: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <span className="font-semibold">End Date:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="w-full text-left">
                      {selectedExpo.endDate.toLocaleDateString()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      selected={selectedExpo.endDate}
                      onSelect={(date) => setSelectedExpo({ ...selectedExpo, endDate: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Input
                value={selectedExpo.organizerName}
                onChange={(e) => setSelectedExpo({ ...selectedExpo, organizerName: e.target.value })}
                placeholder="Organizer Name"
              />
              <Input
                value={selectedExpo.organizerContact}
                onChange={(e) => setSelectedExpo({ ...selectedExpo, organizerContact: e.target.value })}
                placeholder="Organizer Contact"
              />
              <Input
                value={selectedExpo.totalBooths}
                onChange={(e) => setSelectedExpo({ ...selectedExpo, totalBooths: Number(e.target.value) })}
                placeholder="Total Booths"
                type="number"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="default" onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <DialogClose asChild>
              <Button variant="destructive">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowAllExpos;
