import { Outlet, Navigate } from 'react-router-dom'

const App = () => {

  const authToken = localStorage.getItem('token');
  return authToken ? <Outlet /> : <Navigate to="/login" />;


}

export default App
