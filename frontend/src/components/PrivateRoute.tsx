import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';


export const PrivateRoute = () => {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};