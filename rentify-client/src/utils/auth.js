import {jwtDecode} from "jwt-decode";

export const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.role;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};