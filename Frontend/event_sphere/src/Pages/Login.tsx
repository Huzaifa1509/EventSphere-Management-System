import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/Components/ui/Toaster';
import { Progress } from '@/Components/ui/Progress';

const formSchema = z.object({
  email: z.string().min(5).max(100).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/),
  password: z.string().min(8).max(80),
})

const Login = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setProgress(20)
    console.log(values)
    try {
      setProgress(50)
      axios.post('api/users/login', values)
        .then(response => {
          setProgress(65)
          console.log(response.data)
          if (response.status === 200 && response.data.token) {
            setProgress(80)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast({
              variant: "default",
              title: "Success",
              description: "You have been logged in successfully",
            })
            setProgress(100)

            const userRole = response.data.user.role;
            if (userRole === 'ATTENDEE') {
              setLoading(false)
              navigate('/dashboard/attendee');
            } else {
              setLoading(false)
              navigate('/dashboard');
            }
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

    } catch (error) {
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
            <h1 className="text-2xl font-semibold mb-6 text-center">Verifying, Please wait...</h1>
          </div>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
                <FormField
                  control={form.control}
                  name="email"
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
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Hack123!" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter your password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Forgot Password */}
                <Link to="/forget-password" className='text-red-500'>Forgot Password</Link>
                <br />
                <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit"><LogIn /> Login</Button>
              </form>
            </Form>
            <Link to="/register" className='text-rose-950 mt-5'>Don't have an account?</Link>

          </>
        )
        }

      </div>
      <Toaster />
    </>
  )
}

export default Login
