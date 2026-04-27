const { scryptSync, createCipheriv, randomBytes, createHash } = require('crypto');

const PROTECT = (privateKey, masterPassword) => {
    try {
        const strengthenedPassword = createHash('sha3-512').update(masterPassword).digest();
        const salt = randomBytes(32);
        const key = scryptSync(strengthenedPassword, salt, 32, { 
            N: 65536, 
            r: 8, 
            p: 1, 
            maxmem: 128 * 1024 * 1024 
        });

        const iv = randomBytes(12);
        const cipher = createCipheriv('aes-256-gcm', key, iv);
        const encrypted = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()]);        
        const tag = cipher.getAuthTag();
        const bundle = Buffer.concat([salt, iv, tag, encrypted]);
        return bundle.toString('base64url');
    } catch (err) {
        throw new Error("ENCRYPTION_FAILED: Internal Security Error.");
    }
};

module.exports = { PROTECT };
