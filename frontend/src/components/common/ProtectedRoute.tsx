import { Navigate, Outlet } from 'react-router-dom';
import { STORAGE_KEYS, ROUTES } from '@/constants';

export const ProtectedRoute = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
