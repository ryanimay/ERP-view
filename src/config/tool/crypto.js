import CryptoJS from 'crypto-js';

const secretKey = 'mySecretKey';

export default {
    encryptData: (data) => CryptoJS.AES.encrypt(data, secretKey).toString(),
    decryptData: (data) => CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8),
};