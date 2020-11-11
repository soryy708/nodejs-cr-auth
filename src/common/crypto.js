const { pbkdf2 } = require('crypto');

function hash(plainText, salt, rounds) {
    const keyLength = 64; // in bytes
    const digestAlgorithm = 'sha512';
    return new Promise((resolve, reject) => {
        pbkdf2(plainText, salt, Number(rounds), keyLength, digestAlgorithm, (err, derivedKey) => {
            if (err) {
                reject(err);
                return;
            }
            const hashed = derivedKey.toString('hex');
            resolve(hashed);
        })
    });
}

module.exports = {
    hash,
};
