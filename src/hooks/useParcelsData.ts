import { useEffect, useState } from "react";

export function useParcelsData(filename: string) {
    const [data, setData] = useState(null);
    const fetchUrl = `${import.meta.env.BASE_URL}data/${filename}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(fetchUrl);
                const data = await response.json();
                setData(data);
            }
            catch (error) {
                console.error("Fetch error: ", error);
            }
        }
        fetchData();
    }, [fetchUrl]);

    return { data }
}