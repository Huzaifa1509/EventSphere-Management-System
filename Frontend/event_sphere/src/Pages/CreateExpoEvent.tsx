import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { Textarea } from '@/Components/ui/Textarea'
import { CircleFadingArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/Components/ui/Toaster';
import { Calendar } from "@/components/ui/Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

const formSchema = z.object({
    name: z.string().min(5).max(50),
    description: z.string().min(5).max(500),
    startDate: z.date(),
    endDate: z.date(),
    venue: z.string().min(5).max(50),
    organizerName: z.string().min(5).max(50),
    organizerContact: z.string().min(5).max(50),
    totalBooths: z.number(),
})

const CreateExpoEvent = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

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
            totalBooths: 0
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        try {
            axios.post('api/expos', values)
                .then(response => {
                    console.log(response.data);
                    if (response.status === 201 && response.data.token) {

                        toast({
                            variant: "default",
                            title: "Success",
                            description: "You have created an Expo event successfully",
                        })
                        navigate('/dashboard')
                    }
                })
                .catch(error => {
                    console.error("Error: ", error.response.data.message);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.response.data.message,
                    })
                });
        } catch (error) {
            console.error("Catch Error: ", error);
        }
    }

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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
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
                                            <Textarea placeholder="Event Description" {...field} />
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
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
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
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
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
                                            <Input placeholder="John Doe" {...field} />
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
                                            <Input type="tel" placeholder="+12345678910" {...field} />
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
                                            <Input placeholder="10" type="number" {...field} />
                                        </FormControl>
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
                            <CircleFadingArrowUp /> Add Event
                        </Button>
                    </form>
                </Form>
                <Link to="/" className="text-rose-950 mt-5">
                    Show All Events
                </Link>
            </div>
            <Toaster />

        </>
    )
}

export default CreateExpoEvent
