/**
* Gestione dei materiali di consumo con i vari impatti ambientali
*/
 const express = require('express');
 const router = express.Router();
 const Material = require('./models/material.js').Material; 

 router.get('', async (req, res) => {
 
    let materials = await Material.find({});
    materials = materials.map( (material) => {
        return {
            self: '/api/v1/materials/' + material["_id"],
            name: material["name"]
        };
    });
    res.status(200).json(materials);
});

router.get('/:id', async (req, res) => {

    let material = await Material.findById(req.params.id);
    material = {
        self: '/api/v1/materials/' + material.id,
        name: material["name"],
        unitImpact: material["unitImpact"]
    }

    res.status(200).json(material);
});

module.exports = router;
