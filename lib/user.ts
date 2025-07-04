export const setUserId = (id: string) => {
    localStorage.setItem('userId', id)
}

export const getUserId = () => {
    return localStorage.getItem('userId') || '';
}
