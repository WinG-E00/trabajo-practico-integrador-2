import { useState, useEffect } from 'react';



export const useFetch = (url) => {


    const [ data, setData ] = useState(null);
    const [ isLoading, setLoading] = useState(true);
    const [ error, setError ] = useState(null);



    const fetchData = async () => {

        setLoading(true);
        setError(null);

        try {
            
            const response = await fetch(url, {
                credentials: 'include'
            });

            
            if(!response.ok){
                throw new Error(`Error en la petición: ${response.status}`)
            }


            const result = await response.json();
            setData(null);







        } catch (errors) {
            
            setError(errors.message);
            setData(null)

        } finally {
            setLoading(false)
        }
    
    };


    return { data, isLoading, error }
}