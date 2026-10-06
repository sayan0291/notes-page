export const dataFilterNewest = (data) => {
        const sortedItems = [...data].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        return sortedItems;
}

export const dataFilterOldest = (data) => {
    const sortedItems = [...data].sort((a, b) => a.updated_at.localeCompare(b.updated_at));
    return sortedItems;
}