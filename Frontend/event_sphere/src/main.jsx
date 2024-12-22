import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Pages/Login.tsx'
import Register from './Pages/Register.tsx'
import ForgetPassword from './Pages/ForgetPassword.tsx'
import VerifyOTP from './Pages/VerifyOTP.tsx'
import PasswordReset from './Pages/PasswordReset.tsx'
import Dashboard from './Pages/Dashboard.tsx'
import Exhibitor from './Pages/Exhibitor.tsx'
import CreateExpoEvent from './Pages/CreateExpoEvent.tsx'
import CreateBooth from './Pages/CreateBooth.tsx'
import Attendee from './Pages/Attendee.tsx'
import ShowAllBooth from './Pages/ShowAllBooth.tsx'
import VerifyCode from './Pages/VerifyCode.tsx'
import ShowAllExpos from './Pages/ShowAllExpos.tsx'
import { EventList } from './Components/attendee/event-list.tsx'
import { ExhibitorSearch } from './Components/attendee/exhibitor-search.tsx'
import { ScheduleManager } from './Components/attendee/schedule-manager.tsx'
import LayoutAttendee  from './Components/attendee/layout-attendee.tsx'
import UpdateEvent from './Pages/UpdateEvent.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import AllRequests from './Pages/AllRequests.tsx'
import Allexhibitors from './Pages/AllExhibitors.tsx'
import _404 from './Error/_404.tsx'

const value = localStorage.getItem('token');

const router = createBrowserRouter(

  createRoutesFromElements(
    <>
    <Route path="/" element={ value ? <Navigate to="/dashboard" replace /> : <App />}>
      <Route index element={<Login />} />
      <Route path="register" element={  <Register />} />
      <Route path="forget-password" element={<ForgetPassword />} />
      <Route path="verify/:otp" element={<VerifyCode />} />
      <Route path="exhibitor" element={<Exhibitor />} />
      <Route path="expoevents" element={<CreateExpoEvent />} />
      <Route path="attendee" element={<Attendee />} />
      <Route path="verify-otp/:otp?" element={<VerifyOTP />} />
      <Route path="reset-password" element={<PasswordReset />} />
    </Route>

    <Route path="*" element={<_404 />} />

    <Route path="/dashboard" element={<ProtectedRoute />}>
      <Route index element={<Dashboard />} />
      <Route path="expoevents" element={<CreateExpoEvent />} />
      <Route path="editexpo/:expoId" element={<UpdateEvent />} />
      <Route path="booth" element={<CreateBooth />} />
      <Route path="allbooths" element={<ShowAllBooth />} />
      <Route path="allevents" element={<ShowAllExpos />} />
      <Route path="exhibitor" element={<Exhibitor />} />
      <Route path="requests" element={<AllRequests/>} />
      <Route path="exhibitors" element={<Allexhibitors/>} />

      <Route path="attendee" element={<LayoutAttendee />}>
      <Route index element={<Attendee />} />
      <Route path="events" element={<EventList />} />
      <Route path="exhibitor" element={<ExhibitorSearch />} />
      <Route path="schedule" element={<ScheduleManager />} />
      </Route> 

    </Route>
  </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
