import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from '../hooks/useForm';

export const RegisterPage = () => {
    const { form, handleInputChange, handleReset } = useForm({
        username: '', email: '', password: '', first_name: '', last_name: '', biography: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setError('');
        setValidationErrors([]);

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...form, role: 'user' }),
            });
            if (response.status >= 500) {
                throw new Error('Ocurrió un error en el servidor. Intentá nuevamente.');
            }
            const result = await response.json();
            if (response.status === 400) {
                setValidationErrors((result.errors ?? []).map((item) => ({
                    id: JSON.stringify([item.type, item.path, item.location, item.msg]),
                    message: item.msg,
                })));
                setError('Revisá los datos del formulario.');
                return;
            }
            if (!response.ok) {
                const message = response.status === 401
                    ? 'No estás autorizado para realizar el registro.'
                    : response.status === 403
                        ? 'No tenés permisos para realizar el registro.'
                        : 'No se pudo crear la cuenta.';
                throw new Error(message);
            }
            handleReset();
            navigate('/login', {
                replace: true,
                state: { message: 'Cuenta creada correctamente. Ya podés iniciar sesión.' },
            });
        } catch (err) {
            setError(err instanceof TypeError
                ? 'No se pudo conectar con el servidor.' : err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow">
                <h1 className="text-2xl font-bold">Crear cuenta</h1>
                <fieldset disabled={isLoading} className="space-y-4">
                    <legend className="sr-only">Datos de la cuenta y del perfil</legend>
                    <div>
                        <label htmlFor="register-username" className="mb-1 block font-medium">Usuario</label>
                        <input id="register-username" name="username" autoComplete="username" required
                            minLength={3} maxLength={20} value={form.username} onChange={handleInputChange}
                            className="w-full rounded border border-gray-300 p-2" />
                        <p className="mt-1 text-sm text-gray-600">Entre 3 y 20 caracteres alfanuméricos.</p>
                    </div>
                    <div>
                        <label htmlFor="register-email" className="mb-1 block font-medium">Correo electrónico</label>
                        <input id="register-email" name="email" type="email" autoComplete="email" required
                            maxLength={100} value={form.email} onChange={handleInputChange}
                            className="w-full rounded border border-gray-300 p-2" />
                    </div>
                    <div>
                        <label htmlFor="register-password" className="mb-1 block font-medium">Contraseña</label>
                        <input id="register-password" name="password" type="password" autoComplete="new-password"
                            required minLength={8} value={form.password} onChange={handleInputChange}
                            aria-describedby="password-help" className="w-full rounded border border-gray-300 p-2" />
                        <p id="password-help" className="mt-1 text-sm text-gray-600">
                            Mínimo 8 caracteres, una minúscula, una mayúscula y un número.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="first-name" className="mb-1 block font-medium">Nombre</label>
                            <input id="first-name" name="first_name" autoComplete="given-name" required
                                minLength={2} maxLength={50} value={form.first_name} onChange={handleInputChange}
                                className="w-full rounded border border-gray-300 p-2" />
                        </div>
                        <div>
                            <label htmlFor="last-name" className="mb-1 block font-medium">Apellido</label>
                            <input id="last-name" name="last_name" autoComplete="family-name" required
                                minLength={2} maxLength={50} value={form.last_name} onChange={handleInputChange}
                                className="w-full rounded border border-gray-300 p-2" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="biography" className="mb-1 block font-medium">Biografía (opcional)</label>
                        <textarea id="biography" name="biography" rows={3} maxLength={500}
                            value={form.biography} onChange={handleInputChange}
                            className="w-full rounded border border-gray-300 p-2" />
                    </div>
                </fieldset>
                {error && <p role="alert" className="text-red-600">{error}</p>}
                {validationErrors.length > 0 && (
                    <ul className="list-inside list-disc text-sm text-red-600">
                        {validationErrors.map((item) => <li key={item.id}>{item.message}</li>)}
                    </ul>
                )}
                <button type="submit" disabled={isLoading}
                    className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {isLoading ? 'Creando cuenta...' : 'Registrarme'}
                </button>
                <p className="text-center text-sm">¿Ya tenés cuenta?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">Iniciá sesión</Link>
                </p>
            </form>
        </main>
    );
};
