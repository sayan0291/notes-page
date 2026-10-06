import { useState,useEffect } from "react"
import * as nsfwjs from "nsfwjs"

export default function useNSFW() {
    const [model,setModel] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    
    useEffect(()=>{
        let isMounted = true;

        async function init() {
            try {
                const loaded = await nsfwjs.load();
                if (!isMounted) return;
                setModel(loaded);
                setError(null);
            } catch (err) {
                if (!isMounted) return;
                console.error("NSFW scanner failed to load:", err);
                setError(err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        init();

        return () => {
            isMounted = false;
        };
    },[]);

    return {
        model,
        loading,
        error
    };
}
