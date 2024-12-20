import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/Components/ui/Card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/Dialog'
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

  const displayedEvents = limit ? expos.slice(0, limit) : expos;

  return (
    <div className="pb-4">
      {loading ? (
        <div className="grid gap-4">
         {Array.from({ length: 6 }).map((_, index) => (
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
                  <Button onClick={() => setSelectedEvent(event)}>Register</Button>
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
