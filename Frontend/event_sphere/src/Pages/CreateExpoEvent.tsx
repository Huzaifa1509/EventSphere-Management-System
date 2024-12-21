import { React, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import { CircleFadingArrowUp, Calendar as CalendarIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/Components/ui/Toaster';
import { Calendar } from "@/Components/ui/Calendar";
import { Progress } from "@/components/ui/progress";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    name: z.string().min(5).max(50),
    description: z.string().min(50).max(500),
    startDate: z.date(),
    endDate: z.date(),
    venue: z.string().min(5).max(50),
    organizerName: z.string().min(5).max(50),
    organizerContact: z.string().min(11).max(14),
    totalBooths: z.coerce.number().min(1),
    totalBoothsf2: z.coerce.number().min(0),
    totalBoothsf3: z.coerce.number().min(0),
});

const CreateExpoEvent = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            startDate: new Date(),
            endDate: new Date(),
            venue: "",
            organizerName: "",
            organizerContact: "",
            totalBooths: 0,
            totalBoothsf2: 0,
            totalBoothsf3: 0
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        console.log(values);

        try {
            axios.post('/api/expos', values)
                .then(response => {
                    console.log(response.data);
                    if (response.status === 201) {
                        setShowProgress(true);
                        setProgress(0);

                        const interval = setInterval(() => {
                            setProgress((prev) => {
                                if (prev >= 100) {
                                    clearInterval(interval);
                                    toast({
                                        variant: "default",
                                        title: "Success",
                                        description: "You have created an Expo event successfully",
                                    });
                                    navigate('/dashboard');
                                    setShowProgress(false);
                                    return 100;
                                }
                                return prev + 10;
                            });
                        }, 200);
                    }
                })
                .catch(error => {
                    console.error("Error: ", error.response?.data?.message);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.response?.data?.message || "An error occurred.",
                    });
                });
        } catch (error) {
            console.error("Catch Error: ", error);
        }
    }

    return (
        <>

            <div className="container flex flex-col justify-center items-center mx-auto px-4 ">
                {loading ? (<Progress className="w-full" value={progress} />) : null}
                <h1 className="text-2xl font-semibold mb-6 text-center">Create Event</h1>
                <Form {...form}>
                    <form
                        method="post"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 bg-slate-900 text-white p-5 rounded-2xl w-full max-w-4xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Event Name */}
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

                            {/* Venue */}
                            <FormField
                                control={form.control}
                                name="venue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Venue</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Perl Continental Hotel" {...field} />
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
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal text-slate-800",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? field.value.toDateString() : "Pick a date"}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* End Date */}
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
                                                            "w-full justify-start text-left font-normal text-slate-800",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? field.value.toDateString() : "Pick a date"}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Organizer Name */}
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

                            {/* Organizer Contact */}
                            <FormField
                                control={form.control}
                                name="organizerContact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organizer Contact</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1234567890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Total Booths */}
                            <FormField
                                control={form.control}
                                name="totalBooths"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Booths on Ground Floor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="10" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="totalBoothsf2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Booths on First Floor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="10" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="totalBoothsf3"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Booths on Second Floor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="10" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit">
                            <CircleFadingArrowUp className="mr-2 h-4 w-4" /> Add Event
                        </Button>
                    </form>
                </Form>
                <Link to="/dashboard/allevents" className="text-rose-950 mt-5">Show All Events</Link>


            </div>
            <Toaster />
        </>
    );
};

export default CreateExpoEvent;