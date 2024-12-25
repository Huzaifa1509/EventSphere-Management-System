import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/Components/ui/Skeleton';

const formSchema = z.object({
    companyName: z.string().min(5).max(50),
    companyDescription: z.string().max(500).toLowerCase().optional(),
    companyEmail: z.string().min(5).max(100).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    companyContact: z.string().min(11).max(14),
    companyAddress: z.string().max(50),
    companyService: z.string().max(50),
})

const UpdateCompany = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
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
    },
})

  if (!companyId) {
    return <div className='text-red-500 text-center'>Invalid Company ID</div>;
  }

  useEffect(() => {
    ; (async () => {
      setLoading(true);
      try {
        await axios.get(`/api/get-company/${companyId}`,
            {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            }
        )
          .then((response) => {
            console.log(response.data);
            const companyData = response.data;
            form.setValue('companyName', companyData.companyName);
            form.setValue('companyDescription', companyData.companyDescription);
            form.setValue('companyEmail', companyData.companyEmail);
            form.setValue('companyContact', companyData.companyContact);
            form.setValue('companyAddress', companyData.companyAddress);
            form.setValue('companyService', companyData.companyService);
            toast({
              title: 'Company Data Loaded',
              description: 'Company data has been loaded successfully',
              variant: 'default',
            })
            setLoading(false)
          },
          )
          .catch((error) => {
            setLoading(false)
            console.error(error);
            toast({
              title: 'Error',
              description: 'Failed to load Company data',
              variant: 'destructive',
            });
          });

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch company details',
        });
      }
      finally {
        setLoading(false);
      }
    })();



  }, [/*expoId, form,*/ toast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="space-y-8 bg-slate-500 p-5 rounded-2xl w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skeleton for each input */}
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="col-span-full h-24 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
          {/* Skeleton for submit button */}
          <Skeleton className="h-12 w-32 rounded-md" />
        </div>
      </div>
    );
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {

      axios.put(`/api/update-company/${companyId}`, values,
        {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
      )
        .then((response) => {
          console.log(response.data);
          toast({
            variant: 'success',
            title: 'Success',
            description: 'Company updated successfully',
          });

          navigate('/dashboard/allcompanies');
        })
        .catch((error) => {
          console.error(error);
          console.log(error.response.data?.message);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to update company',
          });
        });


    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update company',
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Form {...form}>
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-slate-900 text-white p-5 rounded-2xl w-full max-w-4xl"
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
                                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
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

          </div>
          <Button className='bg-white text-black hover:bg-black hover:text-white' type="submit">Save Changes</Button>
        </form>
        <div className="flex items-center justify-end space-x-2 pt-6">
        </div>
      </Form>
    </div>
  );
};

export default UpdateCompany;
