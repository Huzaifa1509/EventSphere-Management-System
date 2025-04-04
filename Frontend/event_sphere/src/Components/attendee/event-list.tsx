import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/Dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/Components/ui/Toaster';
import { Skeleton } from "../ui/Skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface EventListProps {
  limit?: number;
}

interface ExpoEvents {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  organizerName: string;
  organizerContact: string;
  totalBooths: number;
}

// Zod Schema Validation
const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email address'),
});

export function EventList({ limit }: EventListProps) {
  const [expos, setExpos] = useState<ExpoEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<ExpoEvents | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const response = await axios.get("/api/expos");
        const data = response.data.map((event: ExpoEvents) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        }));
        setExpos(data);
      } catch (error) {
        console.error("Error fetching expos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpos();
  }, []);

  // React Hook Form setup
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    if (!selectedEvent) return;

    try {
      const response = await axios.post(`/api/register-for-expo/${selectedEvent._id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast({
        variant: 'default',
        title: 'Success',
        description: response.data.message,
      });
    } catch (error) {
      console.error("Error registering for expo:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || "Registration failed",
      });
    }
  };


  const handleRegisterClick = async (event: ExpoEvents) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login page if token is not present
    } else {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;
  
        // Fetch user profile
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const userProfile = response.data;
        formMethods.setValue('name', userProfile.name);
        formMethods.setValue('email', userProfile.email);
        setSelectedEvent(event);
      } catch (error) {
        console.error("Invalid token or error fetching user profile:", error);
        navigate('/'); // Redirect to login page if token is invalid
      }
    }
  };

  const displayedEvents = limit ? expos.slice(0, limit) : expos;

  return (
    <div className="pb-4">
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full rounded-lg" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        displayedEvents.map((event) => (
          <Card key={event._id} className="mb-4">
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>
                {event.startDate.toDateString()} -{" "}
                {event.endDate.toDateString()} | {event.venue}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p
                style={{
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {event.description}
              </p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => handleRegisterClick(event)}>Register</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Register for {selectedEvent?.name}</DialogTitle>
                    <DialogDescription>
                      Enter your details to register for the event.
                    </DialogDescription>
                  </DialogHeader>
                  <FormProvider {...formMethods}>
                    <Form onSubmit={formMethods.handleSubmit(handleRegister)} className="space-y-4">
                      <FormField
                        control={formMethods.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formMethods.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Your Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">Confirm Registration</Button>
                      </DialogFooter>
                    </Form>
                  </FormProvider>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))
      )}
      <Toaster />
    </div>
  );
}
