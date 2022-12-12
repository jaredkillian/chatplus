import { AES, enc } from 'crypto-js';

export const encryptWithAES = (text) => {
    const passphrase = process.env.PASSPHRASE;
    return AES.encrypt(enc.Utf8.parse(text), `${passphrase}`).toString();
};

export const decryptWithAES = (ciphertext) => {
    const passphrase = process.env.PASSPHRASE;
    const bytes = AES.decrypt(ciphertext, `${passphrase}`);
    return bytes.toString(enc.Utf8);
}