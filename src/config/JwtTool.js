import jwt_encode from 'vue-jwt-decode';

export function tokenExpired(token) {
    if (token) {
        try {
            const decodedToken = jwt_encode.decode(token);
            if (decodedToken && decodedToken.exp) {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                return decodedToken.exp < currentTimestamp;
            }
        } catch (error) {
            console.log('ErrorToken:' + error);
        }
        return true;
    } else {
        return true;
    }
}