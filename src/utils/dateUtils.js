export const utcToLocalDate = (isoDate) => {
    const date = new Date(isoDate)
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
}