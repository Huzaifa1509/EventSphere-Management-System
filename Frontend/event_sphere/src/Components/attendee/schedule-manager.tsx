import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/Components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/Tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/Toaster";
import { NotificationManager } from "./notification-manager";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/Dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Session {
  _id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  floor: string;
  capacity: number;
  day: number;
  expo: any;
}

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email address"),
});

export function ScheduleManager() {
  const [bookmarkedSessions, setBookmarkedSessions] = useState<string[]>([]);
  const [registeredSchedule, setRegisteredSchedule] = useState<Session[]>([]);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchRegisteredSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/get-registered-expo-sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRegisteredSchedule(response.data);
      } catch (error) {
        console.error("Error fetching registered schedule:", error);
      }
    };

    const fetchAllSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/get-all-sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllSessions(response.data);
      } catch (error) {
        console.error("Error fetching all sessions:", error);
      }
    };

    fetchRegisteredSchedule();
    fetchAllSessions();
  }, []);

  const toggleBookmark = (sessionId: string) => {
    setBookmarkedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );

    const session =
      registeredSchedule.find((s) => s._id === sessionId) ||
      allSessions.find((s) => s._id === sessionId);
    if (session) {
      toast({
        title: bookmarkedSessions.includes(sessionId)
          ? "Session Unbookmarked"
          : "Session Bookmarked",
        description: `${session.name} on ${new Date(
          session.startTime
        ).toLocaleDateString()} at ${new Date(
          session.startTime
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      });
    }
  };

  const handleRegisterClick = async (session: Session) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login page if token is not present
    } else {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        // Fetch user profile
        const response = await axios.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userProfile = response.data;
        formMethods.setValue("name", userProfile.name);
        formMethods.setValue("email", userProfile.email);
        setSelectedSession(session);
      } catch (error) {
        console.error("Invalid token or error fetching user profile:", error);
        navigate("/"); // Redirect to login page if token is invalid
      }
    }
  };

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    if (!selectedSession) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/register-for-session/${selectedSession._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRegisteredSchedule((prev) => [...prev, selectedSession]);
      toast({
        variant: "default",
        title: "Success",
        description: `Successfully registered for ${selectedSession.name}`,
      });
    } catch (error) {
      console.error("Error registering for session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Registration failed",
      });
    }
  };

  const groupSessionsByDay = (sessions: Session[]) => {
    return sessions.reduce((acc, session) => {
      const day = `Day ${session.day}`;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(session);
      return acc;
    }, {} as Record<string, Session[]>);
  };

  const groupedRegisteredSchedule = groupSessionsByDay(registeredSchedule);
  const groupedAllSessions = groupSessionsByDay(allSessions);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registered Event Schedule</CardTitle>
          <CardDescription>Browse and bookmark sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Day 1">
            <TabsList>
              {Object.keys(groupedRegisteredSchedule).map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(groupedRegisteredSchedule).map(
              ([day, sessions]) => (
                <TabsContent key={day} value={day}>
                  {sessions.map((session) => (
                    <div
                      key={session._id}
                      className="flex justify-between items-center mb-4 p-4 bg-secondary rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{session.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(session.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant={
                          bookmarkedSessions.includes(session._id)
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() => toggleBookmark(session._id)}
                      >
                        {bookmarkedSessions.includes(session._id)
                          ? "Bookmarked"
                          : "Bookmark"}
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              )
            )}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
          <CardDescription>
            Browse and bookmark all available sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Day 1">
            <TabsList>
              {Object.keys(groupedAllSessions).map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(groupedAllSessions).map(([day, sessions]) => (
              <TabsContent key={day} value={day}>
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="flex justify-between items-center mb-4 p-4 bg-secondary rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{session.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(session.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={
                          bookmarkedSessions.includes(session._id)
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() => toggleBookmark(session._id)}
                      >
                        {bookmarkedSessions.includes(session._id)
                          ? "Bookmarked"
                          : "Bookmark"}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={
                              registeredSchedule.some(
                                (s) => s._id === session._id
                              )
                                ? "secondary"
                                : "outline"
                            }
                            onClick={() => handleRegisterClick(session)}
                            disabled={registeredSchedule.some(
                              (s) => s._id === session._id
                            )}
                            style={{
                              backgroundColor: registeredSchedule.some(
                                (s) => s._id === session._id
                              )
                                ? "black"
                                : undefined,
                              color: registeredSchedule.some(
                                (s) => s._id === session._id
                              )
                                ? "white"
                                : undefined, // Ensure text is white when button is black
                              cursor: registeredSchedule.some(
                                (s) => s._id === session._id
                              )
                                ? "not-allowed"
                                : "pointer", // Change cursor to indicate it's disabled
                            }}
                          >
                            {registeredSchedule.some(
                              (s) => s._id === session._id
                            )
                              ? "Registered"
                              : "Register"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              Register for {selectedSession?.name}
                            </DialogTitle>
                            <DialogDescription>
                              Enter your details to register for the session.
                            </DialogDescription>
                          </DialogHeader>
                          <FormProvider {...formMethods}>
                            <Form
                              onSubmit={formMethods.handleSubmit(
                                handleRegister
                              )}
                              className="space-y-4"
                            >
                              <FormField
                                control={formMethods.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your Name"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={formMethods.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        placeholder="Your Email"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="submit">
                                  Confirm Registration
                                </Button>
                              </DialogFooter>
                            </Form>
                          </FormProvider>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <NotificationManager
        bookmarkedSessions={bookmarkedSessions}
        schedule={registeredSchedule}
      />
      <Toaster />
    </>
  );
}
