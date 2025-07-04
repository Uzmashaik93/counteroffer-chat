export const setUserId = (id: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('userId', id);
    }
};

export const getUserId = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userId') || '';
    }
    return '';
};
