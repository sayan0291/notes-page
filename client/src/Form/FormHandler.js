import { supabase } from "../Database/Supabase-client";


export const addNotes = async (Notesdata) => {
    const {data,error} = await supabase.from('NotesFolder').insert(Notesdata).single();
    if(error){
        console.log("error in add data",error);
        return;
    }
}

export const readData = async (setNotes) => {
    const {data,error} = await supabase.from("NotesFolder").select("*").order("created_at",{ascending: true})

    if(error){
        console.error("error in Read Data",error);
        return;
    }else{
        setNotes(data);
    }
}

export const deleteData = async (id) => {

    const {data,error} = await supabase.from("NotesFolder").delete().eq("id",id)

}