import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/Components/ui/Toaster';
// import { AsyncEncryptStorage } from 'encrypt-storage';

const formSchema = z.object({
  name: z.string().min(5).max(50),
  email: z.string().min(5).max(50).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/),
  password: z.string().min(2).max(50),
  role: z.string().min(2).max(50).toUpperCase(),
  phone: z.string().min(11).max(14),
  organization: z.string().optional(),
})

const Register = () => {
  const { toast } = useToast()
  const navigate = useNavigate()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "ATTENDEE",
      phone: "",
      organization: "",
    },
  })


  function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)


    // const encryptStorage = new AsyncEncryptStorage('eventSphere', {
    //   localStorage: 'localStorage',
    //   expirationTime: 1800000, // 30mins
    // });

    try {
      axios.post('/api/verify', { email: values.email, name: values.name })
        .then(response => {
          console.log(response.data);
          if (response.status === 200 && response.data.otp) {
            console.log(response.data.otp);
            // encryptStorage.setItem('tmp_user', JSON.stringify(values));
            // encryptStorage.setItem('otp', response.data.otp);
            localStorage.setItem('tmp_user', JSON.stringify(values));
            localStorage.setItem('otp', response.data.otp);
            toast({
              variant: "default",
              title: "Success",
              description: "Code has been sent to your email. Please verify in the next 30 minutes",
            })
            // navigate('/dashboard')
          }

        })
        .catch(error => {
          console.error("Error: ", error.response?.data.message);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response?.data.message,
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
          <form method='post' onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">

            <FormField

              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className='w-full' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ORGANIZER">Organizer</SelectItem>
                      <SelectItem value="EXHIBITOR">Exhibitor</SelectItem>
                      <SelectItem value="ATTENDEE">Attendee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+12345678910" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />


            {/* I only want to display organization field if role is organizer */}
            {form.watch('role') === 'ORGANIZER' && (
              <FormField
                control={form.control}
                name='organization'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Event Sphere" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit"><Key /> Register</Button>
          </form>
        </Form>
        <Link to="/" className='text-rose-950 mt-5'>Already have an account?</Link>
      </div>

      <Toaster />
    </>
  )
}

export default Register
