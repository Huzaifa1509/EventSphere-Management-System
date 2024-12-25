import React from 'react'
import { ThemeProvider } from '@/Components/attendee/theme-provider'
import { MainNav } from '@/Components/attendee/main-nav'
import { UserNav } from '@/Components/attendee/user-nav'
import { cn } from '@/lib/utils'
import { Navigate, Outlet } from 'react-router-dom'

const LayoutAttendee = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;

  if (userRole !== 'ATTENDEE') {
    return <Navigate to="*" replace />;
  }

  
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {/* <div className={cn('min-h-screen bg-background font-sans antialiased')}> */}
        {/* Header */}
        {/* <header className="sticky top-0 z-50 border-b bg-background">
          <div className="container flex h-16 mx-5 items-center justify-between">
            <MainNav />
            <UserNav />
          </div>
        </header> */}

        {/* Main Content */}
        <main className="flex-1 container mx-auto">
          <Outlet />
        </main>
      {/* </div> */}
    </ThemeProvider>
  )
}

export default LayoutAttendee
