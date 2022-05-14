const express = require('express');
const TransportActivity = require('./models/transportActivity.js');
const Vehicle = require('./models/vehicle.js').Vehicle;
const router = express.Router();


router.get('', async (req, res) => {

    let activities = await TransportActivity.find({});

    res.status(200).json(activities);
});

router.get('/:id', async (req, res) => {

    let activity = await TransportActivity.findById(req.params.id);

    res.status(200).json(activity);
});

module.exports = router;