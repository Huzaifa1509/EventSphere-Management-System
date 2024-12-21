import React, { useEffect } from "react";
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function MainNav() {
  const location = useLocation()

  useEffect(() => {
    console.log(location.pathname)
  }, [location])

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        to=""
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Home
      </Link>
      <Link
        to="events"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "events" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Events
      </Link>
      <Link
        to="exhibitor"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/attendee/exhibitor" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Exhibitors
      </Link>
      <Link
        to="schedule"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/attendee/schedule" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Schedule
      </Link>
    </nav>
  )
}