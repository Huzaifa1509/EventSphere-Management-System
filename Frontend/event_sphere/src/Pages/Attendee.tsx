import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/Components/ui/Skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/Components/ui/Dialog"; // Shadcn Dialog Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit } from "lucide-react"; // Icons for delete and edit
import { useToast } from "@/hooks/use-toast"; // For toast notifications
import { Input } from "@/components/ui/Input"; // Input for the form
import { Calendar } from "@/components/ui/Calendar"; // Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"; // Popover component
import { EventList } from '@/components/attendee/event-list';
import { ThemeProvider } from "@/Components/attendee/theme-provider";


const Attendee: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [tokenExists, setTokenExists] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setTokenExists(true);
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        // Fetch user profile
        axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          setUserName(response.data.name);
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
        });
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="container mx-auto">
        {tokenExists ? (
          <>
            <h1 className="text-4xl font-bold mb-10">Welcome Back {userName}</h1>
            <div className="mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Don't miss out on these exciting events</CardDescription>
                </CardHeader>
                <CardContent>
                  <EventList limit={2} />
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to="events">View All Events</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Exhibitors</CardTitle>
                  <CardDescription>Explore exhibitor profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Discover innovative companies and connect with industry leaders.</p>
                  <Button asChild>
                    <Link to="exhibitor">Find Exhibitors</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                  <CardDescription>Plan your event experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Browse sessions, create your personal agenda, and never miss a beat.</p>
                  <Button asChild>
                    <Link to="schedule">Check Schedule</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Don't miss out on these exciting events</CardDescription>
              </CardHeader>
              <CardContent>
                <EventList limit={2} />
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link to="events">View All Events</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Exhibitors</CardTitle>
                <CardDescription>Explore exhibitor profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Discover innovative companies and connect with industry leaders.</p>
                <Button asChild>
                  <Link to="/">Find Exhibitors</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>Plan your event experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Browse sessions, create your personal agenda, and never miss a beat.</p>
                <Button asChild>
                  <Link to="/">Check Schedule</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Attendee;
