import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const formSchema = z.object({
  email: z.string().min(5).max(100).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/),
  password: z.string().min(8).max(80),
})

const Login = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

  }
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96 bg-slate-900 text-white p-5 rounded-2xl">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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

      </div>
    </>
  )
}

export default Login
