import { useEffect, useState } from 'react';

// La función de petición está fuera del efecto y recibe su señal de cancelación.
const fetchData = async (url, signal, setState) => {
    setState({ data: null, isLoading: true, error: null });
    try {
        const response = await fetch(url, { credentials: 'include', signal });
        if (!response.ok) {
            throw new Error(response.status === 401
                ? 'Tu sesión no está disponible. Iniciá sesión nuevamente.'
                : 'No se pudieron obtener los artículos.');
        }
        const data = await response.json();
        if (!signal.aborted) setState({ data, isLoading: true, error: null });
    } catch (err) {
        if (!signal.aborted) setState({ data: null, isLoading: true, error: err.message });
    } finally {
        if (!signal.aborted) setState((previous) => ({ ...previous, isLoading: false }));
    }
};

export const useFetch = (url) => {
    const [state, setState] = useState({ data: null, isLoading: true, error: null });

    useEffect(() => {
        const controller = new AbortController();
        fetchData(url, controller.signal, setState);
        return () => controller.abort();
    }, [url]);

    return state;
};
