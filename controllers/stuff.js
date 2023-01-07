const Thing = require('../models/Thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    });
    thing.save()
        .then(() => res.status(201).json({message: 'Objet enregistré'}))
        .catch(error => {res.status(400).json({ error})});
};

exports.modifyThing =  (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}; //s'il n'y pas d'objet transmis on le recup dans le corps de la requête

    delete thingObject._userId;
    Thing.findOne({_id: req.params.id})
        .then((thing) => {
            if(thing.userId != req.auth.userId){ //on verifie que le id récup en base corresponnd à celui du token
                res.status(401).json({ message: 'Non-autorisé'})
            } else {
                Thing.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id})//destination et objet/id des params de l'url
                .then(() => res.status(200).json({message: 'Objet modifié !'}))
                .catch(error => res.status(401).json({error}));
            }
        })
        .catch((error) => res.status(400).json({error}));
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id})
        .then(thing => {
            if(thing.userId != req.auth.userId){
                res.status(401).json({message: 'Non-autorisé'})
            } else {
                const filename =thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => { //supprimé le fichier du système fichier (srveur) (fs.unlink), la suite c'est le callback de unlink ou on supprime l'obj de la base de données
                    Thing.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({error}));
                });
            };
        })
        .catch(error => {
            res.status(500).json({error});
        })

};

exports.getOneThing = (req, res, next) => { // pour n'en trouver qu'un
    Thing.findOne({ _id: req.params.id }) //on cherche celui qui a le même _id que id
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
    Thing.find() //récupère tous les things
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({error}));
};