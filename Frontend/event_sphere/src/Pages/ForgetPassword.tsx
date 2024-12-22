import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { BadgeCheck, RotateCcw, LockKeyhole } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/Components/ui/Toaster';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/Input-otp"

const formEmailSchema = z.object({
    email: z.string().min(5).max(100).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/),
})

const formOtpSchema = z.object({
    otp: z.string().min(6).max(6),
})

const formPasswordSchema = z.object({
    password: z.string().min(6).max(100),
})

const ForgetPassword = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const { token } = useParams()
    const [isSession, setIsSession] = useState(false)
    const [otpConfirmed, setOtpConfirmed] = useState(false)
    const [displayPasswordForm, setDisplayPasswordForm] = useState(false)

    console.log("Token", token)

    const formEmail = useForm<z.infer<typeof formEmailSchema>>({
        resolver: zodResolver(formEmailSchema),
        defaultValues: {
            email: "",
        },
    })

    const formOtp = useForm<z.infer<typeof formOtpSchema>>({
        resolver: zodResolver(formOtpSchema),
        defaultValues: {
            otp: "",
        },
    });

    const formPassword = useForm<z.infer<typeof formPasswordSchema>>({
        resolver: zodResolver(formPasswordSchema),
        defaultValues: {
            password: "",
        },
    })
    if (token) {
        console.log(token)
    }

    useEffect(() => {
        if (token) {
            console.log("Token from URL:", token);
            sessionStorage.setItem('otp', token);
            setOtpConfirmed(true);
            setIsSession(true);
        }

        if (sessionStorage.getItem('otp')) {
            setIsSession(true);
        }
    }, [token]);


    function onSubmitOtp(values: z.infer<typeof formOtpSchema>) {
        console.log(values)
        try {
            //    Verify OTP
            if (values.otp === sessionStorage.getItem('otp') || values.otp === token) {
                console.log('OTP verified')
                setOtpConfirmed(true)
                setDisplayPasswordForm(true)
                setIsSession(false)
                sessionStorage.removeItem('otp')
                toast({
                    variant: "default",
                    title: "Success",
                    description: "OTP verified successfully.",
                })
            }

        } catch (error) {
            console.error("Error: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid OTP",
            })
        }
    }

    function onSubmit(values: z.infer<typeof formEmailSchema>) {
        console.log(values);
        try {
            axios.post('/api/password-reset-otp', values)
                .then(response => {
                    console.log(response.data);
                    if (response.status === 200 && response.data.token) {
                        sessionStorage.setItem('otp', response.data.token);
                        sessionStorage.setItem('email', values.email); // Store email in sessionStorage
                        setIsSession(true);
                        toast({
                            variant: "default",
                            title: "Success",
                            description: "OTP sent to email successfully. Please check your email.",
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.response?.data?.message || "Error occurred while sending OTP.",
                    });
                });
        } catch (error) {
            console.error("Error: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Unexpected error occurred.",
            });
        }
    }


    function onSubmitPassword(values: z.infer<typeof formPasswordSchema>) {
        console.log(values)
        try {
            axios.post('/api/reset-password', { password: values.password, email: formEmail.getValues().email })
                .then(response => {
                    console.log(response.data)
                    if (response.status === 200) {
                        sessionStorage.removeItem('otp');
                        setOtpConfirmed(false)
                        setIsSession(false)
                        setDisplayPasswordForm(false)
                        navigate('/')
                        toast({
                            variant: "default",
                            title: "Success",
                            description: "Password reset successfully.",
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    console.error("Error: ", error.response.data.message);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.response.data.message,
                    })
                })
        }
        catch (error) {
            console.error("Error: ", error.response.data.message);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response.data.message,
            })
        }
    }

    console.log(isSession)


    if (isSession && !displayPasswordForm && !otpConfirmed) {
        return (
            <>
                <div className="flex flex-col items-center justify-center h-screen">
                    <Form {...formOtp}>
                        <form onSubmit={formOtp.handleSubmit(onSubmitOtp)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
                            <FormField
                                control={formOtp.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>OTP</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter OTP"
                                                autoComplete="one-time-code" // Improve autofill behavior for OTP
                                                {...field} // Correctly binds to `formOtp` instance
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the 6-digit OTP sent to your email.
                                            <span className="text-yellow-500">
                                                Do not close the browser before verifying. {field.value}
                                            </span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit"><RotateCcw />Verify OTP</Button>

                        </form>
                        <Link to="/register" className='text-rose-950 mt-5'>Don't have an account?</Link>
                        <Link to="/" className='text-rose-950 mt-5'>Already Registered?</Link>
                    </Form>

                </div>
                <Toaster />
            </>)

    }


    if (!isSession && !displayPasswordForm && !otpConfirmed) {
        return (<>
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
                                        Please enter your email to reset your password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit"><BadgeCheck />Verify Email</Button>
                    </form>
                </Form>
                <Link to="/register" className='text-rose-950 mt-5'>Don't have an account?</Link>
                <Link to="/" className='text-rose-950 mt-5'>Already Registered?</Link>
            </div>
            <Toaster />
        </>)
    }

    if (!isSession && displayPasswordForm && otpConfirmed) {
        return (<>
            <div className="flex flex-col items-center justify-center h-screen">
                <Form {...formPassword}>
                    <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
                        <FormField
                            control={formPassword.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Please enter your new password for {sessionStorage.getItem('email') || 'your account'}.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit"><LockKeyhole />Reset Password</Button>
                    </form>
                </Form>
                <Link to="/register" className='text-rose-950 mt-5'>Don't have an account?</Link>
                <Link to="/" className='text-rose-950 mt-5'>Already Registered?</Link>

            </div >
            <Toaster />
        </>
        )
    }

}



export default ForgetPassword
