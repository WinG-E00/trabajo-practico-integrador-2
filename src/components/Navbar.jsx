import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export const Navbar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(response.status === 403
                    ? 'No tenés permisos para cerrar la sesión.'
                    : 'No se pudo cerrar la sesión. Intentá nuevamente.');
            }

            localStorage.removeItem('isLogged');
            navigate('/login', {
                replace: true,
                state: { message: 'Sesión cerrada correctamente.' },
            });
        } catch (err) {
            setError(err instanceof TypeError
                ? 'No se pudo conectar con el servidor. Intentá nuevamente.'
                : err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <header className="border-b border-gray-200 bg-white">
            <nav aria-label="Navegación principal"
                className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <Link to="/" className="text-lg font-bold text-blue-700 hover:text-blue-900">
                    Home
                </Link>
                <button type="button" onClick={handleLogout} disabled={isLoading}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {isLoading ? 'Cerrando sesión...' : 'Logout'}
                </button>
            </nav>
            {error && (
                <p role="alert" className="mx-auto max-w-5xl px-6 pb-4 text-red-600">
                    {error}
                </p>
            )}
        </header>
    );
};
