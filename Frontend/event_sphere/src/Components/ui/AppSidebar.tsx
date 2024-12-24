import React, { useState } from "react"
import { User, Home, CalendarDays, Calendar1, Store, User2, ChevronUp } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/Sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/Dropdown-menu"


const attendeeItems = [
    {
        title: "Home",
        url: "/dashboard/attendee",
        icon: Home,
    },
    {
        title: "Events",
        url: "/dashboard/attendee/events",
        icon: Calendar1,
    },
    {
        title: "Exhibitors",
        url: "/dashboard/attendee/exhibitor",
        icon: User,
    },
    {
        title: "Schedule",
        url: "/dashboard/attendee/schedule",
        icon: CalendarDays,
    }
]

// Menu items.
const adminItems = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Create Event",
        url: "expoevents",
        icon: CalendarDays,
    },
    {
        title: "Create Booth",
        url: "booth",
        icon: Store,
    },
    {
        title: "View Events",
        url: "allevents",
        icon: Calendar1,
    },
    {
        title: "View Booths",
        url: "allbooths",
        icon: Store,
    },
    {
        title: "Exhibitor Requests",
        url: "/dashboard/requests",
        icon: User,
    },
]

const exhibitorItems = [
    {
        title: "Register Company",
        url: "/dashboard/register-company",
        icon: Home,
    },
    {
        title: "Book Booths For Company",
        url: "/dashboard/exhibitor",
        icon: Calendar1,
    },
    {
        title: "All Exhibitors",
        url: "/dashboard/exhibitors",
        icon: User,
    },
]

export function AppSidebar() {
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const userName = user.name;

    let items = [];
    if (user.role === "ATTENDEE") {
        items = attendeeItems;
    }
    else if(user.role === "EXHIBITOR") {
        items = exhibitorItems;
    }
         else {
        items = adminItems;
    }


    const handleLogout = async () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        if (!localStorage.getItem("user") && !localStorage.getItem("token")) {
            navigate("/");
        }
    }


    return (
        <Sidebar className="dark" side="left" variant="floating" collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>DASHBOARD</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className="text-white" asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="text-white">
                                    <User2 /> <span>{userName}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] hover:cursor-pointer"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer">
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:cursor-pointer">
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:cursor-pointer" onClick={handleLogout}>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
