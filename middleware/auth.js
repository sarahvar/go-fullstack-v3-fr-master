const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; // séparer à l'espace et récup le 1 du tableau donc le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId; //on récup ID
        req.auth = {
            userId: userId //on le transmet à la requête pour authentification
        };
    next();
    } catch(error) {
        res.status(401).json({error});
    }
};