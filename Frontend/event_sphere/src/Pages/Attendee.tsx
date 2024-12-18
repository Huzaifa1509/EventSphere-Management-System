import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/Dialog"; // Shadcn Dialog Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit } from "lucide-react"; // Icons for delete and edit
import { useToast } from "@/hooks/use-toast"; // For toast notifications
import { Input } from "@/components/ui/Input"; // Input for the form
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

const Attendee: React.FC = () => {
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
    </div>
  );
};

export default Attendee;
