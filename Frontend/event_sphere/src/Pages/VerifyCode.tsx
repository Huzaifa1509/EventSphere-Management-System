import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom';
import { Toaster } from '@/Components/ui/Toaster';
import { ShieldCheck } from 'lucide-react';
import axios from 'axios'
// import { AsyncEncryptStorage } from 'encrypt-storage';

const formSchema = z.object({
    otp: z.string().min(1, "OTP is required"), // Validation for OTP input
});

// export const encryptStorage = new AsyncEncryptStorage(import.meta.env.VITE_SECRET_KEY, {
//     localStorage: 'localStorage',
// });

// async function getDecryptedValue(): Promise<any | undefined> {
//     const tmpUser = await encryptStorage.getItem('tmp_user');
//     const otp = await encryptStorage.getItem('otp');

//     if (!tmpUser || !otp) {
//         return undefined;
//     }

//     return { tmpUser: JSON.parse(tmpUser), otp };
// }

const VerifyCode = () => {
    const { otp } = useParams(); // Get OTP from URL params
    const { toast } = useToast(); // Toast for notifications
    const navigate = useNavigate(); // Navigate between routes

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: otp, // Default OTP value from params
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Submitted Values: ", values);

        try {
            // Decrypt the stored values
            // const decryptedData = await getDecryptedValue();
            // if (!decryptedData) {
            //     toast({
            //         variant: "destructive",
            //         title: "Error",
            //         description: "Session expired or data not found. Please try again.",
            //     });
            //     return;
            // }

            // const { tmpUser, otp: storedOtp } = decryptedData;

            // console.log("Decrypted Data: ", decryptedData);
            // Verify OTP

            const getOtp = localStorage.getItem('otp');
            const tmpUser = localStorage.getItem('tmp_user');

            console.log(tmpUser);


            if (values.otp !== getOtp) {
                toast({
                    variant: "destructive",
                    title: "Invalid OTP",
                    description: "The OTP you entered is incorrect.",
                });
                return;
            }

            const parsedTmpUser = JSON.parse(tmpUser || '');

            // Post the user data to the backend API
            axios.post('/api/users', parsedTmpUser)
                .then(async response => {
                    console.log("Response: ", response.data);

                    if (response.status === 201 && response.data.token) {
                        // Remove old keys from local storage
                        // await encryptStorage.removeItem('tmp_user');
                        // await encryptStorage.removeItem('otp');

                        localStorage.removeItem('tmp_user');
                        localStorage.removeItem('otp');

                        // Save new encrypted keys
                        // await encryptStorage.setItem('token', response.data.token);
                        // await encryptStorage.setItem('user', JSON.stringify(response.data.user));

                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('user', JSON.stringify(response.data.user));

                        toast({
                            variant: "default",
                            title: "Success",
                            description: "You have been registered successfully.",
                        });

                        // Navigate to the dashboard
                        navigate('/dashboard');
                    }
                })
                .catch(error => {
                    console.error("Error: ", error.response?.data?.message || error.message);

                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.response?.data?.message || "An error occurred. Please try again.",
                    });
                });

        } catch (error) {
            console.error("Catch Error: ", error);

            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            });
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <Form {...form}>
                    <form
                        method="post"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">

                        {/* OTP Input Field */}
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit">
                            <ShieldCheck /> Register
                        </Button>
                    </form>
                </Form>
            </div>
            <Toaster />
        </>
    );
}

export default VerifyCode;
