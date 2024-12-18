import { Outlet, Navigate } from 'react-router-dom';
// import { EncryptStorage } from 'encrypt-storage';

function ProtectedRoute() {
  // const encryptStorage = new EncryptStorage(import.meta.env.VITE_SECRET_KEY, {
  //   localStorage: 'localStorage',
  // });

  // const value = encryptStorage.getItem('token');

  const value = localStorage.getItem('token');

  return value ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
