export default function pinnedSorting(documents = []){
    const pinNotes = documents.filter((e) => e.pinned === true).map(obj => {
        return obj;
    })
    return pinNotes;
}
