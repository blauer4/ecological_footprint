const express = require('express');
const router = express.Router();
const User = require('./models/user').User;

router.get('', async (req, res) => {
    
    let currentUser = await User.findById(req.loggedUser.id);
    let friends = currentUser.friends;

    friends = friends.map( (friend) => {
        return {
            self: '/api/v2/friends/' + friend["_id"],
            name: friend["name"]
        };
    });
    res.status(200).json(friends);
});


router.get('/:id', async (req, res) => {

    let currentUser = await User.findById(req.loggedUser.id);
    let friends = currentUser.friends;

    let user = req.params.id;
    // if the user you are searching is in my friend list return it
    if (user in friends){
        user = {
            self: '/api/v1/users/' + user.id,
            username: user["username"],
            name: user["name"],
            surname: user["surname"],
            email: user["email"]
        };

        res.status(200).json(user);
    }   

    res.status(404).send("Not found");
});

module.exports = router;
