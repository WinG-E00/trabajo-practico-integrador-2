import { Navigate, Outlet } from 'react-router';

export const PublicRouter = () => localStorage.getItem('isLogged') === 'true'
    ? <Navigate to="/" replace /> : <Outlet />;
