import React, { useEffect, useState } from "react";
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useParams, useNavigate } from "react-router-dom";  // Import useParams and useNavigate
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar } from "@/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useToast } from "@/hooks/use-toast";



const formSchema = z.object({
    name: z.string().min(5).max(50),
    description: z.string().min(50).max(500),
    startDate: z.date(),
    endDate: z.date(),
    venue: z.string().min(5).max(50),
    organizerName: z.string().min(5).max(50),
    organizerContact: z.string().min(5).max(50),
    totalBooths: z.coerce.number().min(1),
});

const UpdateEvent: React.FC = () => {
  const { expoId } = useParams(); 
  console.log("Expo ID:", expoId); 
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [updatedExpo, setUpdatedExpo] = useState<any>({
    name: "",
    description: "",
    venue: "",
    startDate: Date(),
    endDate: Date(),
    organizerName: "",
    organizerContact: "",
    totalBooths: 0,
  });

  useEffect(() => {
    const fetchExpoDetails = async () => {
      try {
        const response = await axios.get(`/api/expos/${expoId}`);
        const expoData = response.data;
        console.log(expoData);
        // setUpdatedExpo({
        //   ...expoData,
        //   startDate: new Date(expoData.startDate),
        //   endDate: new Date(expoData.endDate),
        // });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch event details",
        });
      }
    };

    if (expoId) {
      fetchExpoDetails();
    }
  }, [expoId, toast]);

  const handleSaveChanges = async () => {
    try {
      const payload = {
        ...updatedExpo,
        startDate: updatedExpo.startDate.toISOString(),
        endDate: updatedExpo.endDate.toISOString(),
      };
      await axios.put(`/api/expos/${expoId}`, payload);
      toast({
        variant: "default",
        title: "Success",
        description: "Event updated successfully",
      });
      navigate("/allevents");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Event</h1>
      {updatedExpo && (
        <div className="space-y-4">
          <Input
            value={updatedExpo.name}
            onChange={(e) => setUpdatedExpo({ ...updatedExpo, name: e.target.value })}
            placeholder="Event Name"
          />
          <Input
            value={updatedExpo.description}
            onChange={(e) => setUpdatedExpo({ ...updatedExpo, description: e.target.value })}
            placeholder="Description"
          />
          <Input
            value={updatedExpo.venue}
            onChange={(e) => setUpdatedExpo({ ...updatedExpo, venue: e.target.value })}
            placeholder="Venue"
          />
          <div>
            <span className="font-semibold">Start Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full text-left">
                  {updatedExpo.startDate.toLocaleDateString()}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  selected={updatedExpo.startDate}
                  onSelect={(date) => setUpdatedExpo({ ...updatedExpo, startDate: date })}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <span className="font-semibold">End Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full text-left">
                  {updatedExpo.endDate.toLocaleDateString()}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  selected={updatedExpo.endDate}
                  onSelect={(date) => setUpdatedExpo({ ...updatedExpo, endDate: date })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Input
            value={updatedExpo.organizerName}
            onChange={(e) => setUpdatedExpo({ ...updatedExpo, organizerName: e.target.value })}
            placeholder="Organizer Name"
          />
          <Input
            value={updatedExpo.organizerContact}
            onChange={(e) => setUpdatedExpo({ ...updatedExpo, organizerContact: e.target.value })}
            placeholder="Organizer Contact"
          />
          <Input
            value={updatedExpo.totalBooths}
            onChange={(e) => setUpdatedExpo({ ...updatedExpo, totalBooths: Number(e.target.value) })}
            placeholder="Total Booths"
          />
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      )}
    </div>
  );
};

export default UpdateEvent;
