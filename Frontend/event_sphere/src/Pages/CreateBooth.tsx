import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/Form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/Components/ui/Input';
import { CircleFadingArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/Components/ui/Toaster';

// Zod Schema Validation
const formSchema = z.object({
    boothNumber: z.string().min(4).max(4),
    expoId: z.string().nonempty('Please select an event'),
});

const CreateBooth = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    // State to hold fetched ExpoEvents
    const [expoEvents, setExpoEvents] = useState<Array<{ id: string; name: string }>>([]);

    // Fetch all ExpoEvents dynamically
    useEffect(() => {
        const fetchExpoEvents = async () => {
            try {
                const response = await axios.get('/api/expos');
                setExpoEvents(response.data);
            } catch (error) {
                console.error('Error fetching Expo Events: ', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load Expo events.',
                });
            }
        };

        fetchExpoEvents();
    }, [toast]);

    // React Hook Form setup
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            boothNumber: '',
            expoId: '',
        },
    });

    // Submit Handler
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post('/api/booths', values);
            if (response.status === 201) {
                toast({
                    variant: 'default',
                    title: 'Success',
                    description: 'You have created a booth successfully',
                });
                navigate('/dashboard/allbooths');
            }
        } catch (error) {
            console.error('Error: ', error.response?.data?.message || error.message);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create a booth.',
            });
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <Form {...form}>
                    <form
                        method="post"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 bg-slate-900 text-white p-5 rounded-2xl w-full max-w-4xl"
                    >
                        {/* Form Wrapper for Two Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="boothNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booth Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="5876" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Dropdown to Select Expo Event */}
                            <FormField
                                control={form.control}
                                name="expoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expo Event</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an event" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {expoEvents.map((event) => (
                                                    <SelectItem key={event._id} value={event._id}>
                                                        {event.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            className="w-full bg-white text-black hover:bg-black hover:text-white"
                            type="submit"
                        >
                            <CircleFadingArrowUp /> Add Booth
                        </Button>
                    </form>
                </Form>
                <Link to="/dashboard/allbooths" className="text-rose-950 mt-5">
                    Show All Booths
                </Link>
            </div>
            <Toaster />
        </>
    );
};

export default CreateBooth;
