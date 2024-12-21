import React from "react"
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
} from "@/components/ui/Dropdown-menu"


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

const organizerItems = [
];

const exhibitorItems = [ 
];

// Menu items.
const adminItems = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Expo Events",
        url: "expoevents",
        icon: CalendarDays,
    },
    {
        title: "Booth",
        url: "booth",
        icon: Store,
    },
    {
        title: "Events",
        url: "allevents",
        icon: Calendar1,
    },
    {
        title: "Exhibitor",
        url: "exhibitor",
        icon: User,
    },
]

export function AppSidebar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    let items = [];
    if (user.role === "ADMIN") {
        items = adminItems;
    } else if (user.role === "ORGANIZER") {
        items = organizerItems;
    } else if (user.role === "EXHIBITOR") {
        items = exhibitorItems;
    }else{
        items = attendeeItems;
    }

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem('token'); 
        localStorage.removeItem('user'); 
        navigate('/');
        window.location.reload(); // Force a page reload
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
                                    <User2 /> Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
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
