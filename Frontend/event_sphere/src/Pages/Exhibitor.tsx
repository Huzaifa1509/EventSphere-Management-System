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
import { useLocation } from 'react-router-dom';
import Register from './Register';

const formSchema = z.object({
  productName: z.string().min(2).max(50),
  productDescription: z.string().max(500).toLowerCase(),
  expoId: z.string(),
  companyId: z.string().nonempty("Company is required"),
})


const Exhibitor = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [expos, setExpos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const registeredCompanyId = location.state?.companyId;

  useEffect(() => {

    // if (!companyId) {
    //   toast({
    //       variant: "destructive",
    //       title: "Error",
    //       description: "No company found. Please register your company first.",
    //   });

    //   navigate('/dashboard/register-company', { replace: true });
    // }

    const fetchExpos = async () => {
      try {
        const response = await axios.get("/api/expos",{ headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
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

    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/get-companies-by-exhibitor", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
    fetchExpos();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      expoId: "",
      companyId: registeredCompanyId ? registeredCompanyId : "",
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
        console.log(form.getValues())
      if (!selectedBooth) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a booth before saving.",
        });
        return;
      }
      // Step 1: Post the exhibitor data
      axios
        .post('/api/exhibitor', {
          ...form.getValues(),
          boothId: selectedBooth._id,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })
        .then((response) => {
          console.log(response);
            toast({
              variant: "default",
              title: "Your booth request has been submitted",
              description: "Wait for admin approval.",
            })
            setIsModalOpen(false);
            fetchBooths(selectedBooth.expoId);

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


  const onSubmit = async (values) => {
    if(!form.getValues().expoId){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an Expo.",
      });
      return;
    }
    await fetchBooths(values.expoId);
    setIsModalOpen(true);
  };


  return (
    <>

      <div className="container flex flex-col justify-center items-center mx-auto px-4 mt-12">
        <h1 className="text-2xl font-semibold mb-3 text-center">Register For Booths</h1>
        <p className='capitalize font-semibold'>You've successfully registered your company! Next, select an expo to showcase your products and book a booth by clicking 'Get Booths'.</p>
        <p className='capitalize font-semibold mb-3'>Remember, you must wait for admin approval for your selected booth. Once approved, you'll receive an email at your company email address, and your company card will appear in the listings.</p>
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full bg-slate-900 text-white p-12 rounded-xl"
          >
             {/* Company Field */}
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Company</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)} // Handle change
                      value={field.value} // Select company by default
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              {/* Expo Field */}
              <FormField
                control={form.control}
                name="expoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
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

              {/* Product Name Field */}
              <FormField
                control={form.control}
                name="productName"
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

              {/* Product Description Field */}
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Product Description Here....."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                <strong>Assigned to:</strong> {booth.Assignedto == null ? "Nobody" : booth.Assignedto}
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