
/**
 * @swagger
 *  paths:
 *      /api/v2/friends:
 *          get:
 *              summary: Retrieve all the friends present in the database
 *              description: Returns a json object with the resource link and the name of the friend. Requires authentication
 *              responses:
 *                  '200': 
 *                      description: Returns a json object with self link of the resource and the name of the friend
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties: 
 *                                      self: 
 *                                          type: string
 *                                          description: The link to the api resource
 *                                      name: 
 *                                          type: string
 *                                          description: The name of the friend given
 *          put:
 *              summary: Add a new friend
 *              description: Updates the friends list with a new friend. Requires authentication
 *              requestBody:
 *                  required: true
 *                  content: 
 *                      application/x-www-form-urlencoded:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  userId:
 *                                      type: string
 *                                      description: The id of the user that you want to insert as a new friend
 *              responses:
 *                  '201': 
 *                      description: Return the link to the resource that i created or found
 *      /api/v2/friends/{id}:
 *          get:
 *              summary: Get the specified friend by ID
 *              description: Returns a friend with lots of information like username, name, surname, email. Requires authentication
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    required: true
 *                    description: The id of the correspondent friend you would like to search for presence
 *                    schema: 
 *                      type: string
 *              responses:
 *                  '200': 
 *                      description: Return the json of the before mentioned properties of the user
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      self: 
 *                                          type: string
 *                                          description: The link to the api user
 *                                      username: 
 *                                          type: string
 *                                          description: The username of the given friend
 *                                      name: 
 *                                          type: string
 *                                          description: The name of the given friend
 *                                      surname: 
 *                                          type: string
 *                                          description: The surname of the given friend
 *                                      email: 
 *                                          type: string
 *                                          description: The email of the given friend
 */

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
            username: friend["username"]
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
        return friend.id.equals(userId);
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
    newFriendsList.push({id: userId, username: newFriend.username});


    await User.findByIdAndUpdate(req.loggedUser.id, { friends: newFriendsList });
    res.location(`/api/v2/friends/${userId}`).status(200).send();
   
})

module.exports = router;
