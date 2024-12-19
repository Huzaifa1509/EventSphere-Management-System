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
import Modal from "react-modal";


const formSchema = z.object({
  companyName: z.string().min(5).max(50),
  companyDescription: z.string().max(500).toLowerCase().optional(),
  productName: z.string().min(2).max(50),
  productDescription: z.string().max(500).toLowerCase(),
  services: z.string().max(50),
  expoId: z.string(),
  requireDocument: z
    .instanceof(File, { message: "A valid file is required." })
    .or(z.any()),
})


const Exhibitor = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [expos, setExpos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [companyDescription, setCompanyDescription] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [services, setServices] = useState(null);
  const [expoId, setExpoId] = useState(null);
  const [requireDocument, setRequireDocument] = useState(null);


  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const response = await axios.get("/api/expos");
        console.log(response)
        setExpos(response.data);
      } catch (error) {
        console.error("Error fetching expos:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch expos. Please try again later.",
        });
      }
    };

    fetchExpos();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyDescription: "",
      productName: "",
      productDescription: "",
      services: "",
      expoId: "",
      requireDocument: z
        .instanceof(File, { message: "A valid file is required." })
        .or(z.any()),
    },
  })

  const fetchBooths = async (expoId) => {
    try {
      const response = await axios.get(`/api/booths/${expoId}`);
      setBooths(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch booths.",
      });
    }
  };


  async function onBoothSubmit() {

    try {
      console.log(form.getValues());
      // const { requireDocument, ...values } = form.getValues();

      if (!selectedBooth) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a booth before saving.",
        });
        return;
      }

      console.log(selectedBooth)

      // Step 1: Post the exhibitor data
      axios
        .post('/api/exhibitor', form.getValues(), {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response);
          toast({
            variant: "default",
            title: "Exhibitor Saved",
            description: "Exhibitor data saved successfully.",
          })
        })
        // Step 2: Update the booth's booking status
        // return axios.put(
        //   `/api/boothBooked/${selectedBooth._id}`,
        //   { isBooked: true },
        //   { headers: { 'Content-Type': 'application/json' } }
        // )
        //   .then((response) => {
        //     console.log(response);
        //     toast({
        //       variant: "default",
        //       title: "Booth Booked",
        //       description: `Booth ${selectedBooth.boothNumber} has been booked successfully.`,
        //     })

        //   })
        //   .then(() => {
        //     toast({
        //       variant: "default",
        //       title: "Booth Booked",
        //       description: `Booth ${selectedBooth.boothNumber} has been booked successfully.`,
        //     });
        //     setIsModalOpen(false); // Close the modal after saving
        //     // Optionally, refresh the booth list
        //     fetchBooths(selectedBooth.expoId);
        //   })
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


  const onSubmit = async (values) => {
    await fetchBooths(values.expoId);
    setIsModalOpen(true);
    setCompanyDescription(values.companyDescription);
    setCompanyName(values.companyName);
    setProductName(values.productName);
    setProductDescription(values.productDescription);
    setServices(values.services);
    setExpoId(values.expoId);
    setRequireDocument(values.requireDocument);
  };


  return (
    <>

      <div className="flex flex-col items-center justify-center h-screen">
        <Form {...form}>
          <form method='post' onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full bg-slate-900 text-white p-12" encType="multipart/form-data">

            <FormField

              control={form.control}
              name="expoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expo</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value)} // Bind the selected value to the field
                      value={field.value} >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an Expo" />
                      </SelectTrigger>
                      <SelectContent>
                        {expos.map((expo) => (
                          <SelectItem key={expo._id} value={expo._id}>
                            {expo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="requireDocument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Document</FormLabel>
                  <FormControl>
                    <Input
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

            <Button className="bg-white text-black hover:bg-black hover:text-white" type="submit"><Send /> Save</Button>
          </form>
        </Form>
      </div>


      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-xl font-bold mb-4">Select a Booth</h2>
        <div className="grid grid-cols-3 gap-4">
          {booths.map((booth) => (
            <div
              key={booth._id}
              className={`p-4 border rounded ${selectedBooth?._id === booth._id ? "bg-blue-500 text-white" : ""
                }`}
              onClick={() => setSelectedBooth(booth)}
            >
              <h3 className="text-lg font-semibold">{booth.boothNumber}</h3>
              <p>
                <strong>Assigned to:</strong> {booth.Assignedto || "Not Assigned"}
              </p>
              <p>
                <strong>Booked:</strong> {booth.isBooked ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={onBoothSubmit} >
          Save Booth
        </Button>
        <Button className="mt-4 ml-2 bg-red-500" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
      </Modal>

      <Toaster />
    </>
  )
}

export default Exhibitor