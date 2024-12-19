import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Pages/Login.tsx'
import Register from './Pages/Register.tsx'
import ForgetPassword from './Pages/ForgetPassword.tsx'
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
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import { Layout } from 'lucide-react'
// import { EncryptStorage } from 'encrypt-storage';

// const encryptStorage = new EncryptStorage(import.meta.env.VITE_SECRET_KEY, {
//     localStorage: 'localStorage',
//   });

// const value = encryptStorage.getItem('token');

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
      
 
    </Route>
    
      <Route path="/attendee" element={<LayoutAttendee />}>
      <Route index element={<Attendee />} />
      <Route path="events" element={<EventList />} />
      <Route path="exhibitor" element={<ExhibitorSearch />} />
      <Route path="schedule" element={<ScheduleManager />} />

      </Route> 

      <Route path="exhibitor" element={<Exhibitor />} />
    <Route path="/dashboard" element={<ProtectedRoute />}>
      <Route index element={<Dashboard />} />
      <Route path="expoevents" element={<CreateExpoEvent />} />
      <Route path="booth" element={<CreateBooth />} />
      <Route path="allbooths" element={<ShowAllBooth />} />
      <Route path="allevents" element={<ShowAllExpos />} />
    </Route>
  </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
