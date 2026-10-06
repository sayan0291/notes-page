import pinnedSorting from "../lib/filter/pinnedSorting.js"
import tagsSorting from "../lib/filter/tagsSorting.js"

export default function dataHandle(data,documents) {
    
    if( data==="pincheck" ){
        const sortednotes = pinnedSorting(documents);
        return sortednotes;
    }else if(data==="allnote"){
        return documents;
    }
    else if(["work", "personal", "ideas", "study"].includes(data)){
        const sortedNotes = tagsSorting(documents,data)
        return sortedNotes;
    }

    return [];
}
