import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    productName: z.string().min(2).max(50),
    productDescription: z.string().max(500).toLowerCase(),
    services: z.string().max(50),
    requireDocument: z
    .instanceof(File, { message: "A valid file is required." })
    .or(z.any()),
  })
  
 
const Exhibitor = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        companyName: "",
        companyDescription: "",
        productName: "",
        productDescription: "",
        services: "",
        requireDocument:""
      },
    })
  
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
  
      try {
        axios.post('api/exhibitor', values)
          .then(response => {
            console.log(response.data);
            if (response.status === 201) {
              toast({
                variant: "default",
                title: "Success",
                description: "You have successfully created a company",
              })
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
            <form method='post' onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full bg-slate-900 text-white p-12" encType="multipart/form-data">
  
              <FormField
  
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="IBEX ...." {...field} className='w-full' type="text" />
                    </FormControl>
  
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="companyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Description Here....." {...field} />
                    </FormControl>
  
                    <FormMessage />
  
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name='productName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Name" type="text" {...field} />
                    </FormControl>
  
                    <FormMessage />
                  </FormItem>
                )}
              />
  
  
                <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Product Description Here....." {...field} />
                    </FormControl>
  
                    <FormMessage />
  
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="services"
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
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name='requireDocument'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Official Document</FormLabel>
                    <FormControl>
                      <Input placeholder="Please Insert Your Document" type='file' {...field} />
                    </FormControl>
  
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="bg-white text-black hover:bg-black hover:text-white" type="submit"><Send /> Save</Button>
            </form>
          </Form>
        </div>
  
        <Toaster />
      </>
    )
  }
  
  export default Exhibitor