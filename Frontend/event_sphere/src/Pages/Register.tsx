import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/Form';
import { Input } from '@/Components/ui/Input'
import { Key } from 'lucide-react';
import { Link } from 'react-router-dom';


const formSchema = z.object({
  email: z.string().min(5).max(50).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/),
  name: z.string().min(5).max(50),
  password: z.string().min(2).max(50),
  role: z.string().min(2).max(50).toUpperCase(),
  phone: z.string().min(13).max(14),
  organization: z.string().min(2).max(50),
})

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: "",
      phone: "",
      organization: "",
    },
  })

  const onSubmit = (values) => {
    // Do something with the form values.
    // This will be validated.
    console.log(values)
  }
  // name,
  // email,
  //   password,
  //     role,
  //     phone,
  //     organization,

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
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />
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

            {/* Role - With Select*/}
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
                    <Input placeholder="Fishy!!!$$" {...field} />
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
                    <Input placeholder="+12345678910" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full bg-white text-black hover:bg-black hover:text-white" type="submit"><Key /> Register</Button>
          </form>
        </Form>

      </div>

    </>
  )
}

export default Register
