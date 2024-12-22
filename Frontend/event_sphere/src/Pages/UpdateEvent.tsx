import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/Components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/Popover';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/Components/ui/Skeleton';

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

const UpdateEvent = () => {
  const { expoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      venue: '',
      organizerName: '',
      organizerContact: '',
      totalBooths: 0,
    },
  });

  if (!expoId) {
    return <div className='text-red-500 text-center'>Invalid Expo ID</div>;
  }

  useEffect(() => {
    ; (async () => {
      setLoading(true);
      try {
        await axios.get(`/api/expos/${expoId}`)
          .then((response) => {
            console.log(response.data);
            const expoData = response.data;
            form.setValue('name', expoData.name);
            form.setValue('description', expoData.description);
            form.setValue('startDate', new Date(expoData.startDate));
            form.setValue('endDate', new Date(expoData.endDate));
            form.setValue('venue', expoData.venue);
            form.setValue('organizerName', expoData.organizerName);
            form.setValue('organizerContact', expoData.organizerContact);
            form.setValue('totalBooths', expoData.totalBooths);
            toast({
              title: 'Event Data Loaded',
              description: 'Event data has been loaded successfully',
              variant: 'default',
            })
            setLoading(false)
          },
          )
          .catch((error) => {
            setLoading(false)
            console.error(error);
            toast({
              title: 'Error',
              description: 'Failed to load Expo data',
              variant: 'destructive',
            });
          });

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch event details',
        });
      }
      finally {
        setLoading(false);
      }
    })();



  }, [/*expoId, form,*/ toast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="space-y-8 bg-slate-500 p-5 rounded-2xl w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skeleton for each input */}
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="col-span-full h-24 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
          {/* Skeleton for submit button */}
          <Skeleton className="h-12 w-32 rounded-md" />
        </div>
      </div>
    );
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const payload = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      axios.put(`/api/expos/${expoId}`, payload)
        .then((response) => {
          console.log(response.data);
          toast({
            variant: 'success',
            title: 'Success',
            description: 'Event updated successfully',
          });

          navigate('/dashboard/allevents');
        })
        .catch((error) => {
          console.error(error);
          console.log(error.response.data?.message);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to update event',
          });
        });


    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update event',
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Form {...form}>
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-slate-900 text-white p-5 rounded-2xl w-full max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Expo Event Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your event here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal text-slate-800',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? field.value.toDateString() : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal text-slate-800',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? field.value.toDateString() : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Organizer Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizerContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Organizer Contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalBooths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Booths</FormLabel>
                  <FormControl>
                    <Input placeholder="Total Booths" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
        <div className="flex items-center justify-end space-x-2 pt-6">
        </div>
      </Form>
    </div>
  );
};

export default UpdateEvent;
