const multer = require('multer');

const MIME_TYPES ={ //traduction des types de fichiers (dico)
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') //null pour dire no error
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; //élément du dico qui correspond au mimetype du fichier envoyé
        callback(null, name + Date.now() + '.' + extension);    
    }
});

module.exports = multer({ storage }).single('image'); //pour dire à multer que ce sont des fichiers unique de type image