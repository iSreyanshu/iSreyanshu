const { scryptSync, createDecipheriv, createHash } = require('crypto');

const UNLOCK = (vaultString, masterPassword) => {
    try {
        const bundle = Buffer.from(vaultString, 'base64url');
        const salt = bundle.subarray(0, 32);
        const iv = bundle.subarray(32, 44);
        const tag = bundle.subarray(44, 60);
        const encryptedData = bundle.subarray(60);
        const strengthenedPassword = createHash('sha3-512').update(masterPassword).digest();
        const key = scryptSync(strengthenedPassword, salt, 32, { 
            N: 65536, 
            r: 8, 
            p: 1, 
            maxmem: 128 * 1024 * 1024 
        });

        const decipher = createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        let decrypted = decipher.update(encryptedData, null, 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (err) {
        return "ACCESS_DENIED: Authentication Failure.";
    }
};

module.exports = { UNLOCK };
