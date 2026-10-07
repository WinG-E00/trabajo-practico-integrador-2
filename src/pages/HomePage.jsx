import { useLocation } from 'react-router';
import { useFetch } from '../hooks/useFetch';


export const HomePage = () => {


    const location = useLocation();
    const { data, isLoading, error } = useFetch(
        'http://localhost:3000/api/articles'
    );

    const articles = data?.todosLosArticulos ?? [];

    if (isLoading) {
        return (
            <p className="p-6 text-gray-600 "  >
                CargandoArticulos...
            </p>
        );
    }

    if (error) {
    return (
        <p role="alert" className="p-6 text-red-600">
            {error}
        </p>
    );
}


    return (
    <main className="mx-auto max-w-5xl p-6">
        {location.state?.message && (
            <p role="status" className="mb-4 text-green-700">{location.state.message}</p>
        )}
        <h1 className="mb-6 text-3xl font-bold">
            Artículos publicados
        </h1>

        {articles.length === 0 ? (
            <p className="text-gray-600">
                No hay artículos publicados.
            </p>
        ) : (
            <div className="grid gap-4 md:grid-cols-2">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        className="rounded-lg border border-gray-200 p-5"
                    >
                        <h2 className="text-xl font-semibold">
                            {article.title}
                        </h2>

                        <p className="mt-2 text-gray-600">
                            {article.excerpt}
                        </p>

                        <p className="mt-4 text-sm text-gray-500">
                            Autor: {article.author?.username ?? 'Sin autor'}
                        </p>
                    </article>
                ))}
            </div>
        )}
    </main>
);

};

