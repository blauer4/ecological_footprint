/**
* Gestione dei materiali di consumo con i vari impatti ambientali
*/
 const express = require('express');
 const router = express.Router();
 const Material = require('./models/material.js').Material; 

 router.get('', async (req, res) => {
 
    let materials = await Material.find({});

    res.status(200).json(materials);
});

router.get('/:id', async (req, res) => {

    let material = await Material.findById(req.params.id);

    res.status(200).json(material);
});

module.exports = router;
