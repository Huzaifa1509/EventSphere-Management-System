import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/Components/ui/Skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/Components/ui/Dialog"; // Shadcn Dialog Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
  toalBoothsf2: number;
  totalBooths3: number;
}

const ShowAllExpos: React.FC = () => {
  const [expos, setExpos] = useState<ExpoEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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


  const handleEdit = (expoId: string) => {
    navigate(`/dashboard/editexpo/${expoId}`);
  };

  return (

      <div className="container mx-auto px-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">All Events</h1>

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
                  <div className="absolute right-4 top-4 flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2"
                      onClick={() => handleDelete(expo._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2"
                      onClick={() => handleEdit(expo._id)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  </div>

                  <CardTitle className="text-lg font-semibold">{expo.name}</CardTitle>
                  <CardDescription className="break-words whitespace-normal overflow-hidden">
                    {expo.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm">
                    <span className="font-semibold">Venue:</span> {expo.venue}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Organizer Name:</span> {expo.organizerName}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Organizer Contact:</span> {expo.organizerContact}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Total Booths:</span> {expo.totalBooths + expo.totalBoothsf3 + expo.totalBoothsf2}
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

export default ShowAllExpos;