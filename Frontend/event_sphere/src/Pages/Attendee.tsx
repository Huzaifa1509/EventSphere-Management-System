import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/Dialog"; // Shadcn Dialog Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit } from "lucide-react"; // Icons for delete and edit
import { useToast } from "@/hooks/use-toast"; // For toast notifications
import { Input } from "@/components/ui/Input"; // Input for the form
import { Calendar } from "@/components/ui/Calendar"; // Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"; // Popover component
import { EventList } from '@/components/attendee/event-list';
import LayoutAttendee from '@/Components/attendee/layout-attendee'
import { ThemeProvider } from "@/Components/attendee/theme-provider";



// interface ExpoEvents {
//   _id: string;
//   name: string;
//   description: string;
//   startDate: Date;
//   endDate: Date;
//   venue: string;
//   organizerName: string;
//   organizerContact: string;
//   totalBooths: number;
// }

const Attendee: React.FC = () => {
  // const [expos, setExpos] = useState<ExpoEvents[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const { toast } = useToast();

  // useEffect(() => {
  //   const fetchExpos = async () => {
  //     try {
  //       const response = await axios.get("/api/expos");
  //       setExpos(response.data);
  //     } catch (error) {
  //       console.error("Error fetching expos:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchExpos();
  // }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-10">Welcome Back Attendee</h1>
      
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
    </div>
    </ThemeProvider>
    );
};

export default Attendee;
