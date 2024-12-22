import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { BadgeCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/Components/ui/Toaster';
import { SignJWT } from 'jose';

const formEmailSchema = z.object({
    email: z.string().min(5).max(100).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/),
})

const ForgetPassword = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const formEmail = useForm<z.infer<typeof formEmailSchema>>({
        resolver: zodResolver(formEmailSchema),
        defaultValues: {
            email: "",
        },
    })

    const secretKey = import.meta.env.VITE_SECRET_KEY
    const secret = new TextEncoder().encode(secretKey)


    async function onSubmit(values: z.infer<typeof formEmailSchema>) {
        console.log(values);
        try {
            const response = await axios.post('/api/password-reset-otp', values)

            console.log(response.data);
            if (response.status === 200 && response.data.token) {
                const otp = response.data.token;
                const token = await new SignJWT({ otp, email: values.email }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setIssuer('event-sphere').setAudience('event-sphere').setExpirationTime('15m').sign(secret);
                console.log("Token: ", token);
                localStorage.setItem('jwt_token', token);
                console.log("Local Storage: ", localStorage.getItem('token'));
                toast({
                    variant: "success",
                    title: "Success",
                    description: "OTP sent to email successfully. Please check your email.",
                });

                navigate(`/verify-otp`);
            }


        } catch (error) {
            console.error("Error: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Unexpected error occurred.",
            });
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <Form {...formEmail}>
                    <form onSubmit={formEmail.handleSubmit(onSubmit)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
                        <FormField
                            control={formEmail.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john.doe@example.com" {...field} autoComplete="off" />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your email address to receive a password reset OTP.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit"><BadgeCheck />Send OTP</Button>
                    </form>
                </Form>
                <Link to="/register" className='text-rose-950 mt-5'>Don't have an account?</Link>
                <Link to="/" className='text-rose-950 mt-5'>Already Registered?</Link>
            </div>
            <Toaster />
        </>
    )

}



export default ForgetPassword
