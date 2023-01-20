const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}
exports.newSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce)
    delete req.body.sauce._id
    const newSauce = new Sauce({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    newSauce.save()
    .then(() => res.status(201).json({message: req.body}))
    .catch(error => res.status(400).json({ error }))
  .catch(error => res.status(500).json({ error }))
}
