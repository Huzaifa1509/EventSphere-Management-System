import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { BadgeCheck, RotateCcw, LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/Components/ui/Toaster';
import { jwtVerify } from 'jose';
import { Progress } from "@/Components/ui/Progress";

const formPasswordSchema = z.object({
    password: z.string().min(6).max(100),
})

const PasswordReset = () => {

    const { toast } = useToast()
    const navigate = useNavigate()
    const jwtToken = localStorage.getItem('jwt_token') ? localStorage.getItem('jwt_token') : null
    const [token, setToken] = useState(jwtToken)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    console.table({ token })

    useEffect(() => {
        ; (async () => {
            console.log("Setting Token")
            setToken(localStorage.getItem('jwt_token'))

        })();
    })

    const formPassword = useForm<z.infer<typeof formPasswordSchema>>({
        resolver: zodResolver(formPasswordSchema),
        defaultValues: {
            password: "",
        },
    })


    async function onSubmitPassword(values: z.infer<typeof formPasswordSchema>) {
        setLoading(true)
        setProgress(20)
        console.log(values)
        try {
            const secretKey = import.meta.env.VITE_SECRET_KEY
            const secret = new TextEncoder().encode(secretKey)
            setProgress(30)
            const decodedEmail = await jwtVerify(token, secret, { issuer: 'event-sphere', audience: 'event-sphere' })
                .then((decoded) => {
                    setProgress(50)
                    console.log(decoded)
                    return decoded.payload.email
                })
                .catch((error) => {
                    console.error(error)
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Invalid Token",
                    })
                })
            console.log(decodedEmail)
            setProgress(70)
            axios.post('/api/reset-password', { password: values.password, email: decodedEmail })
                .then(response => {
                    setProgress(100)
                    console.log(response.data)
                    if (response.status === 200) {
                        localStorage.removeItem('jwt_token')
                        toast({
                            variant: "success",
                            title: "Success",
                            description: "Password reset successfully.",
                        })
                        setLoading(false)
                        navigate('/')
                    }
                })
                .catch(error => {
                    setLoading(false)
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

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                {loading ? (
                    <div className='flex flex-col justify-center items-center space-y-4 h-screen'>
                        <Progress className="w-full flex justify-center items-center" value={progress} />
                        <h1 className="text-2xl font-semibold mb-6 text-center">Resetting Password...</h1>
                    </div>
                ) : (
                    <>

                        <Form {...formPassword}>
                            <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
                                <FormField
                                    control={formPassword.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="New Password"
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
                    </>
                )}
            </div >
            <Toaster />
        </>
    )
}

export default PasswordReset
