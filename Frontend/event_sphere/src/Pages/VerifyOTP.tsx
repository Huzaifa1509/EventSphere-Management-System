import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { RotateCcw } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/Components/ui/Toaster';
import { jwtVerify, SignJWT } from 'jose';

const formOtpSchema = z.object({
    otp: z.string().min(6).max(6),
})

const VerifyOTP = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const checkToken = localStorage.getItem('jwt_token') ? localStorage.getItem('jwt_token') : null
    const [token, setToken] = useState(checkToken)
    const { otp } = useParams()


    console.table({ token, otp })

    if (!token && !otp) {
        console.log('Invalid Token')
        toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid Token",
        })
        return <>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className='text-2xl text-rose-950'>Invalid Token</h1>
                <Link to="/" className='text-rose-950 mt-5'>Already Registered?</Link>
            </div>

        </>
    }

    useEffect(() => {
        ; (async () => {
            console.log("Setting Token")
            setToken(localStorage.getItem('jwt_token'))

        })()
    }, [token])

    const formOtp = useForm<z.infer<typeof formOtpSchema>>({
        resolver: zodResolver(formOtpSchema),
        defaultValues: {
            otp: otp ? otp : "",
        },
    });

    const secretKey = import.meta.env.VITE_SECRET_KEY
    const secret = new TextEncoder().encode(secretKey)

    async function onSubmitOtp(values: z.infer<typeof formOtpSchema>) {
        console.log("Values: ", values)


        const jwtToken = jwtVerify(token, secret, { issuer: 'event-sphere', audience: 'event-sphere' })
        console.log("JWT Token", jwtToken)
        if (jwtToken) {
            const expiry = await jwtToken.then((token) => token.payload.exp) ?? null
            console.log("Expiry: ", expiry)
            if (expiry < Date.now() / 1000) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Token Expired",
                })
                return
            }
            console.log('Token verified')
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid Token",
            })
            return
        }

        const decodedOTP = await jwtToken.then((token) => token.payload.otp) ?? null
        console.log("Decoded OTP: ", decodedOTP)


        try {
            if (values.otp === decodedOTP || values.otp === otp) {
                console.log('OTP verified')
                localStorage.removeItem('jwt_token');
                const decodeEmail = await jwtToken.then((token) => token.payload.email) ?? null
                console.log("Decoded Email: ", decodeEmail)
                const newJwtToken = await new SignJWT({ email: decodeEmail }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setIssuer('event-sphere').setAudience('event-sphere').setExpirationTime('30m').sign(secret);
                console.log("New JWT Token: ", newJwtToken)
                localStorage.setItem('jwt_token', newJwtToken);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "OTP verified successfully.",
                })
                navigate('/reset-password')
            }
            else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Invalid OTP",
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
                                        <Input placeholder="Enter OTP" {...field} />
                                    </FormControl>
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

export default VerifyOTP
