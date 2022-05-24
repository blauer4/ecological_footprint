const express = require('express');
const router = express.Router();
const User = require('./models/user').User;

router.get('', async (req, res) => {
    
    let currentUser = await User.findById(req.loggedUser.id);
    let friends = currentUser.friends;

    console.log(friends)
    friends = friends.map( (friend) => {
        return {
            self: '/api/v1/users/' + friend["_id"],
            name: friend["name"]
        };
    });
    res.status(200).json(friends);
});

module.exports = router;
