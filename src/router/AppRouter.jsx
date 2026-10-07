import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';

const SessionRedirect = () => (
    <Navigate to={localStorage.getItem('isLogged') === 'true' ? '/' : '/login'} replace />
);

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<PublicRouter />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<PrivateRouter />}>
                <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="*" element={<SessionRedirect />} />
        </Routes>
    </BrowserRouter>
);
