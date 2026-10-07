import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from '../hooks/useForm';

export const LoginPage = () => {
    const { form, handleInputChange } = useForm({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form),
            });

            if (response.status >= 500) {
                throw new Error('Ocurrió un error en el servidor. Intentá nuevamente.');
            }

            const result = await response.json();
            if (!response.ok) {
                let message = 'No se pudo iniciar sesión.';
                if (response.status === 400) {
                    message = result.errors?.map((item) => item.msg).join(' ')
                        || 'Revisá los datos ingresados.';
                } else if (response.status === 401) {
                    message = 'Usuario o contraseña incorrectos.';
                } else if (response.status === 403) {
                    message = 'No tenés permisos para acceder.';
                }
                throw new Error(message);
            }

            localStorage.setItem('isLogged', 'true');
            navigate('/', { replace: true, state: { message: 'Inicio de sesión exitoso.' } });
        } catch (err) {
            setError(err instanceof TypeError
                ? 'No se pudo conectar con el servidor.'
                : err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow">
                <h1 className="text-2xl font-bold">Iniciar sesión</h1>
                {location.state?.message && (
                    <p role="status" className="text-green-700">{location.state.message}</p>
                )}
                <div>
                    <label htmlFor="username" className="mb-1 block font-medium">Usuario</label>
                    <input id="username" name="username" type="text" autoComplete="username"
                        value={form.username} onChange={handleInputChange} required disabled={isLoading}
                        className="w-full rounded border border-gray-300 p-2" />
                </div>
                <div>
                    <label htmlFor="password" className="mb-1 block font-medium">Contraseña</label>
                    <input id="password" name="password" type="password" autoComplete="current-password"
                        value={form.password} onChange={handleInputChange} required disabled={isLoading}
                        className="w-full rounded border border-gray-300 p-2" />
                </div>
                {error && <p role="alert" className="text-red-600">{error}</p>}
                <button type="submit" disabled={isLoading}
                    className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
                <p className="text-center text-sm">¿No tenés cuenta?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">Registrate</Link>
                </p>
            </form>
        </main>
    );
};
