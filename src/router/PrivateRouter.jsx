import { Navigate, Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';

export const PrivateRouter = () => localStorage.getItem('isLogged') === 'true'
    ? <><Navbar /><Outlet /></> : <Navigate to="/login" replace />;
