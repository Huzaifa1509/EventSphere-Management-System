import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/Components/ui/Toaster';
import { Textarea } from "@/Components/ui/Textarea"

const formSchema = z.object({
    companyName: z.string().min(5).max(50),
    companyDescription: z.string().max(500).toLowerCase().optional(),
    companyEmail: z.string().min(5).max(100).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    companyContact: z.string().min(11).max(14),
    companyAddress: z.string().max(50),
    companyService: z.string().max(50),
    requireDocument: z
        .instanceof(File, { message: "A valid file is required." })
        .or(z.any()),
})


const RegisterCompany = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const token = localStorage.getItem("token");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            companyDescription: "",
            companyEmail: "",
            companyContact: "",
            companyAddress: "",
            companyService: "",
            requireDocument: z
                .instanceof(File, { message: "A valid file is required." })
                .or(z.any()),
        },
    })

     function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            axios
                .post('/api/register-company', values, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then((response) => {
                    const companyId = response?.data?.company?._id;
                    toast({
                        variant: "default",
                        title: "Company Registered",
                        description: `Company Registered Successfully.${companyId}`,
                    })
                    navigate('/dashboard/exhibitor', { state: { companyId } });
                })
                .catch((error) => {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.response?.data?.message || "An error occurred during the process.",
                    });
                });

        }
        catch (error) {
            console.error(error);
            console.log(error.response?.data?.message);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "An error occurred during the process.",
            })
        }
    };

    return (
        <>

            <div className="container flex flex-col justify-center items-center mx-auto px-4 mt-12 ">
                <h1 className="text-2xl font-semibold text-center mb-3">Create Company</h1>
                <p className='capitalize font-semibold mb-3'>As an exhibitor, your first step is to create a company profile. Once your company is registered, you can proceed to book booths for your company in the desired expos.</p>
                <Form {...form}>
                    <form
                        method="post"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full bg-slate-900 text-white p-12 rounded-xl"
                        encType="multipart/form-data"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                            {/* Company Name Field */}
                            <FormField 
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="IBEX ...."
                                                {...field}
                                                className="w-full"
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Company Address Field */}
                            <FormField 
                                control={form.control}
                                name="companyAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Official Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Sector ...."
                                                {...field}
                                                className="w-full"
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Company Description Field */}
                            <FormField
                                control={form.control}
                                name="companyDescription"
                                render={({ field }) => (
                                    <FormItem className='col-span-full'>
                                        <FormLabel>Company Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter Description Here....."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* email Field */}
                            <FormField
                                control={form.control}
                                name="companyEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Please enter your email
                                        </FormDescription>
                                        <FormMessage />

                                    </FormItem>
                                )}
                            />
                            {/* Organizer Contact */}
                            <FormField
                                control={form.control}
                                name="companyContact"
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

                            {/* Services Field */}
                            <FormField
                                control={form.control}
                                name="companyService"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company/Org Services</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Service" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
                                                <SelectItem value="MOBILE_APP_DEVELOPMENT">
                                                    Mobile App Development
                                                </SelectItem>
                                                <SelectItem value="UI_UX_DESIGN">UI/UX Design</SelectItem>
                                                <SelectItem value="DIGITAL_MARKETING">
                                                    Digital Marketing
                                                </SelectItem>
                                                <SelectItem value="SEO">
                                                    Search Engine Optimization (SEO)
                                                </SelectItem>
                                                <SelectContent>
                                                    <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
                                                    <SelectItem value="MOBILE_APP_DEVELOPMENT">Mobile App Development</SelectItem>
                                                    <SelectItem value="UI_UX_DESIGN">UI/UX Design</SelectItem>
                                                    <SelectItem value="DIGITAL_MARKETING">Digital Marketing</SelectItem>
                                                    <SelectItem value="SEO">Search Engine Optimization (SEO)</SelectItem>
                                                    <SelectItem value="CLOUD_SERVICES">Cloud Services</SelectItem>
                                                    <SelectItem value="IT_CONSULTING">IT Consulting</SelectItem>
                                                    <SelectItem value="DATA_ANALYTICS">Data Analytics</SelectItem>
                                                    <SelectItem value="CYBERSECURITY">Cybersecurity</SelectItem>
                                                    <SelectItem value="E_COMMERCE_SOLUTIONS">E-Commerce Solutions</SelectItem>
                                                    <SelectItem value="SOFTWARE_DEVELOPMENT">Software Development</SelectItem>
                                                    <SelectItem value="GRAPHIC_DESIGN">Graphic Design</SelectItem>
                                                    <SelectItem value="CONTENT_CREATION">Content Creation</SelectItem>
                                                    <SelectItem value="VIDEO_PRODUCTION">Video Production</SelectItem>
                                                    <SelectItem value="BRAND_STRATEGY">Brand Strategy</SelectItem>
                                                    <SelectItem value="SOCIAL_MEDIA_MANAGEMENT">Social Media Management</SelectItem>
                                                    <SelectItem value="PAYMENT_INTEGRATION">Payment Integration</SelectItem>
                                                    <SelectItem value="CUSTOMER_SUPPORT_SERVICES">Customer Support Services</SelectItem>
                                                    <SelectItem value="DATABASE_MANAGEMENT">Database Management</SelectItem>
                                                    <SelectItem value="NETWORK_INFRASTRUCTURE">Network Infrastructure</SelectItem>
                                                    <SelectItem value="HARDWARE_SUPPORT">Hardware Support</SelectItem>
                                                    <SelectItem value="PRODUCT_DESIGN">Product Design</SelectItem>
                                                    <SelectItem value="VIRTUAL_ASSISTANCE">Virtual Assistance</SelectItem>
                                                    <SelectItem value="EVENT_MANAGEMENT">Event Management</SelectItem>
                                                    <SelectItem value="PROJECT_MANAGEMENT">Project Management</SelectItem>
                                                    <SelectItem value="HR_SERVICES">HR Services</SelectItem>
                                                    <SelectItem value="LEGAL_SERVICES">Legal Services</SelectItem>
                                                    <SelectItem value="TRANSLATION_SERVICES">Translation Services</SelectItem>
                                                    <SelectItem value="LOGISTICS_AND_SHIPPING">Logistics and Shipping</SelectItem>
                                                    <SelectItem value="TRAINING_AND_DEVELOPMENT">Training and Development</SelectItem>
                                                    <SelectItem value="SALES_AND_MARKETING">Sales and Marketing</SelectItem>
                                                    <SelectItem value="PUBLIC_RELATIONS">Public Relations</SelectItem>
                                                    <SelectItem value="TECHNICAL_SUPPORT">Technical Support</SelectItem>
                                                    <SelectItem value="BLOCKCHAIN_DEVELOPMENT">Blockchain Development</SelectItem>
                                                    <SelectItem value="ARTIFICIAL_INTELLIGENCE">Artificial Intelligence</SelectItem>
                                                    <SelectItem value="MACHINE_LEARNING">Machine Learning</SelectItem>
                                                    <SelectItem value="AR_VR_DEVELOPMENT">AR/VR Development</SelectItem>
                                                    <SelectItem value="GAME_DEVELOPMENT">Game Development</SelectItem>
                                                    <SelectItem value="FINANCIAL_SERVICES">Financial Services</SelectItem>
                                                    <SelectItem value="TAX_ACCOUNTING">Tax & Accounting</SelectItem>
                                                    <SelectItem value="INSURANCE_SERVICES">Insurance Services</SelectItem>
                                                    <SelectItem value="REAL_ESTATE_SERVICES">Real Estate Services</SelectItem>
                                                    <SelectItem value="RESEARCH_AND_DEVELOPMENT">Research and Development</SelectItem>
                                                    <SelectItem value="HEALTHCARE_SERVICES">Healthcare Services</SelectItem>
                                                    <SelectItem value="EDUCATIONAL_SERVICES">Educational Services</SelectItem>
                                                    <SelectItem value="TRAVEL_AND_TOURISM">Travel and Tourism</SelectItem>
                                                    <SelectItem value="HOSPITALITY_SERVICES">Hospitality Services</SelectItem>
                                                    <SelectItem value="RETAIL_SERVICES">Retail Services</SelectItem>
                                                    <SelectItem value="SUSTAINABILITY_SERVICES">Sustainability Services</SelectItem>

                                                </SelectContent>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Require Document Field */}
                            <FormField
                                control={form.control}
                                name="requireDocument"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Official Document</FormLabel>
                                        <FormControl>
                                            <Input className='bg-white text-black hover:cursor-pointer'
                                                placeholder="Please Insert Your Document"
                                                type="file"
                                                onChange={(e) => {
                                                    // Use the `field.onChange` to handle the file manually
                                                    if (e.target.files && e.target.files[0]) {
                                                        field.onChange(e.target.files[0]); // Update the value with the selected file
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                className="w-full bg-white text-black hover:bg-black hover:text-white"
                                type="submit"
                            >
                                <Send /> Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            <Toaster />
        </>
    )
}

export default RegisterCompany