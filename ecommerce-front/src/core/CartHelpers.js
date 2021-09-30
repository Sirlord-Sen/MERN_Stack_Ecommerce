
export const emptyCart = next => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        next();
    }
};