import { useContext } from "react";
import NotesContext from "../context/notesContext/notes.context.js"

export default function useNotes() {
    const context = useContext(NotesContext)
    if(!context) {
        throw new Error("useContext must be used inside NotesContextProvider")
    }
    return context;
}
