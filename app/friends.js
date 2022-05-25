const express = require('express');
const { Schema } = require('mongoose');
const router = express.Router();
const User = require('./models/user').User;

router.get('', async (req, res) => {
    
    let currentUser = await User.findById(req.loggedUser.id);
    let friends = currentUser.friends;

    friends = friends.map( (friend) => {
        return {
            self: '/api/v2/friends/' + friend["id"],
            name: friend["name"]
        };
    });
    res.status(200).json(friends);
});


router.get('/:id', async (req, res) => {

    let currentUser = await User.findById(req.loggedUser.id);
    let friends = currentUser.friends;

    let userId = req.params.id;

    if(!userId){
        console.error("Something went wrong! Missing required arguments");
        res.status(400).send("Something went wrong! Missing required arguments");
        return;
    }

    // if the user you are searching is in my friend list return it
    var inMyFriendList = friends.some(function (friend) {
        return friend.equals(userId);
    });

    if (!inMyFriendList){
        console.error("The user is not your friend");
        res.status(400).send("The user is not your friend");
        return;
    }

    // otherwiser return the user details
    let user = await User.findById(userId);
    user = {
        self: '/api/v1/users/' + user.id,
        username: user["username"],
        name: user["name"],
        surname: user["surname"],
        email: user["email"]
    }

    res.status(200).json(user);

});


router.put('', async (req, res) => {
    let userId = req.body.userId;

    if(!userId){
        console.error("Something went wrong! Missing required arguments");
        res.status(400).send("Something went wrong! Missing required arguments");
        return;
    }


    // check if the user is not already in the friend list
    let currentUser = await User.findById(req.loggedUser.id);

    var alreadyIn = currentUser.friends.some(function (friend) {
        return friend.id.equals(userId);
    });

    if (alreadyIn){
        res.status(400).send("The user is already in your friend list");
        return;
    }

    // check if the user tries to add itself to his friends list
    if (userId == currentUser.id){
        res.status(400).send("You cannot add yourself to your friends list");
        return;
    }

    // check if the user you are trying to add as a friend actually exists
    let newFriend = await User.findById(userId);
    if (!newFriend){
        res.status(400).send("You must provide an existing user to be add as a friend");
        return;
    }

    
    // otherwise add the new friend
    let newFriendsList = currentUser.friends;
    newFriendsList.push({id: userId, name: newFriend.name});


    await User.findByIdAndUpdate(req.loggedUser.id, { friends: newFriendsList });
    res.location(`/api/v2/friends/${userId}`).status(200).send();
   
})

module.exports = router;
