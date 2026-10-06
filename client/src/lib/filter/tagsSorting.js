export default function tagsSorting(documents = [], tag) {

    const sortedNotes = documents.filter((e) => e.tags?.includes(tag)).map(obj => {
        return obj;
    })

    return sortedNotes;
}
