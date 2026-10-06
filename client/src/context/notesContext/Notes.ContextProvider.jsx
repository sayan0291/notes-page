import { useCallback, useEffect, useState } from "react";
import { Notes, updateNotePinned } from "../../Database/Supabase-client.js";
import useAuth from "../../hooks/useAuth.js";
import NotesContext from "./notes.context.js"

export default function NotesContextProvider({children}) {
    const [documents,setDocuments] = useState([]);
    const [loading,setLoading] = useState(true);

    const { user } = useAuth();

    const fetchDocuments = useCallback(async () => {
            if(!user) {
                setDocuments([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const notesDocuments = await Notes(user.user_id)
                setDocuments(notesDocuments);

            } catch (error) {
                console.log("notes data",error);
            } finally {
                setLoading(false);
            }
    }, [user])

    const togglePinned = useCallback(async (noteId, nextPinned) => {
        if (!user) return;

        const previousDocuments = documents;
        setDocuments((currentDocuments) =>
            currentDocuments.map((note) =>
                note.id === noteId ? { ...note, pinned: nextPinned } : note
            )
        );

        try {
            const updatedNote = await updateNotePinned({
                noteId,
                userId: user.user_id,
                pinned: nextPinned,
            });

            setDocuments((currentDocuments) =>
                currentDocuments.map((note) =>
                    note.id === noteId ? { ...note, ...updatedNote } : note
                )
            );
        } catch (error) {
            setDocuments(previousDocuments);
            throw error;
        }
    }, [documents, user]);

    useEffect(() => {

        fetchDocuments();
    },[fetchDocuments])

    return (
        <NotesContext.Provider value={{ documents, loading, togglePinned }}>
            {children}
        </NotesContext.Provider>
    )
}
