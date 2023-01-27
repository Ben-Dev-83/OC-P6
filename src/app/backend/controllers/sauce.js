const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}) )
}
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => { res.status(201).json({message: sauceObject})})
    .catch(error => { res.status(400).json( { error })})
 };
 exports.likeSauce = (req, res, next) => {
    const likeSauce = req.body.like
    const userId = req.body.userId
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(likeSauce === 1) {
                Sauce.updateOne({_id: req.params.id}, { $inc: {likes: likeSauce}, $addToSet: {usersLiked: userId} } )
                .then(() => res.status(200).json({message : "J'aime"}))
                .catch(error => res.status(401).json({error}))
            }
            if(likeSauce === -1) {
                Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $addToSet: {usersDisliked: userId}})
                .then(() => res.status(200).json({message : "J'aime pas"}))
                .catch(error => res.status(401).json({error}))
            } else {
                if(sauce.usersLiked.includes(userId)){
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: userId}})
                    .then(() => res.status(200).json({message : "Annule j'aime"}))
                    .catch(error => res.status(401).json({error}))
                }
                if(sauce.usersDisliked.includes(userId)){
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
                    .then(() => res.status(200).json({message : "Annule j'aime pas"}))
                    .catch(error => res.status(401).json({error}))
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 }
 exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject.userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };
 exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
