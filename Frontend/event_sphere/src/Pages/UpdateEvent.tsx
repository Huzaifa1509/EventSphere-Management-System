import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover";

import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters").max(50),
    description: z.string().min(50, "Description must be at least 50 characters").max(500),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    venue: z.string().min(5, "Venue must be at least 5 characters").max(50),
    organizerName: z.string().min(5, "Organizer Name must be at least 5 characters").max(50),
    organizerContact: z.string().min(5, "Organizer Contact must be at least 5 characters").max(50),
});

const UpdateEvent: React.FC = () => {
    const { expoId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            startDate: new Date(),
            endDate: new Date(),
            venue: "",
            organizerName: "",
            organizerContact: "",
        },
    });

    const fetchExpoDetails = async () => {
        if (!expoId) return;
        try {
            setLoading(true);
            const response = await axios.get(`/api/expos/${expoId}`);
            const expoData = response.data;

            setValue("name", expoData.name);
            setValue("description", expoData.description);
            setValue("startDate", new Date(expoData.startDate));
            setValue("endDate", new Date(expoData.endDate));
            setValue("venue", expoData.venue);
            setValue("organizerName", expoData.organizerName);
            setValue("organizerContact", expoData.organizerContact);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch event details",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (expoId) {
            fetchExpoDetails();
        }
    }, [expoId]);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            console.log(data);
            console.log(expoId);
            await axios.put(`/api/expos/${expoId}`, data);
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
                description: expoId ? "Failed to update event" : "Failed to create event",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">
                {expoId ? "Update Event" : "Create Event"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    placeholder="Event Name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                <Input
                    placeholder="Description"
                    {...register("description")}
                    className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}

                <Input
                    placeholder="Venue"
                    {...register("venue")}
                    className={errors.venue ? "border-red-500" : ""}
                />
                {errors.venue && <p className="text-red-500 text-sm">{errors.venue.message}</p>}

                <div>
                    <span className="font-semibold">Start Date:</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="w-full text-left">
                                {watch("startDate")?.toLocaleDateString()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                selected={watch("startDate")}
                                onSelect={(date) => setValue("startDate", date)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <span className="font-semibold">End Date:</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="w-full text-left">
                                {watch("endDate")?.toLocaleDateString()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                selected={watch("endDate")}
                                onSelect={(date) => setValue("endDate", date)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Input
                    placeholder="Organizer Name"
                    {...register("organizerName")}
                    className={errors.organizerName ? "border-red-500" : ""}
                />
                {errors.organizerName && (
                    <p className="text-red-500 text-sm">{errors.organizerName.message}</p>
                )}

                <Input
                    placeholder="Organizer Contact"
                    {...register("organizerContact")}
                    className={errors.organizerContact ? "border-red-500" : ""}
                />
                {errors.organizerContact && (
                    <p className="text-red-500 text-sm">{errors.organizerContact.message}</p>
                )}


                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : expoId ? "Update Event" : "Create Event"}
                </Button>
            </form>
        </div>
    );
};

export default UpdateEvent;
