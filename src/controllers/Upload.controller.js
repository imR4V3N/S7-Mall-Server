const imagekit = require('../config/imagekit');

exports.getAuthParams = (req, res) => {
    try {
        // Cette méthode retourne { signature, expire, token }
        const auth = imagekit.getAuthenticationParameters();

        // Réponse avec TOUS les champs nécessaires
        res.json({
            signature: auth.signature,
            expire: auth.expire,
            token: auth.token,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
