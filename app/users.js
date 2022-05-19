const express = require('express');
const User = require('./models/user').User;
const router = express.Router();

/**
 * @swagger
 * paths:
 *      /api/v1/users
 *          get:
 *              summary: users ids
 *              description: this function retrives the list of users and returns it as a json document
 *              responses:
 *                  '200':
 *                      description: return of the answer to the successful list retrive
 *          post:
 *              summary: insertion of a new user
 *              description: this function allows the insertion of a new user with the corret specified params
 *              requestBody:
 *                  required: true
 *                  content: 
 *                      application/x-www-form-urlencoded:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  name:
 *                                      type: string
 *                                      description: The name of the user  
 *                                  surname:
 *                                      type: string
 *                                      description: The surname of the user  
 *                                  password:
 *                                      type: string
 *                                      description: The password of the user  
 *                                  username:
 *                                      type: string
 *                                      description: The username of the user
 *                                  email:
 *                                      type: string
 *                                      description: The email of the user
 *                              example:
 *                                  description: an example of registration
 *                                  value:
 *                                      name: vittoria
 *                                      surname: ossanna
 *                                      password: 12345678
 *                                      username: vittannaossoria
 *                                      email: ciao@vitt.jpg
 *              responses:
 *                  '302':
 *                      description: the user has been correctly registered
 *                  '404':
 *                      description: username already exixts
 *                  '400':
 *                      description: a compulsory field is missing
 *      /api/v1/users/{id}:
 *          get:
 *              summary: getting a specific user id
 *              description: this function retrives a specifid user id as specified in the req parameter (as json document)
 *              parameters:
 *                  
 *              responses:
 *                  '200':
 *                      description: return of the answer to the successful retrive
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      self:
 *                                      username:
 *                                      name:
 *                                      surname
 *                                      email:
 *                                  example:
 *                                      self: /api/v1/users/{id}
 *                                      username: vittossanna
 *                                      name: vittoria
 *                                      surname: ossanna
 *                                      email: ciao@vitt.jpg    
 */

router.get('', async (req, res) => {
 
    let users = await User.find({});
    users = users.map( (user) => {
        return {
            self: '/api/v1/users/' + user["_id"],
            username: user["username"]
        };
    });
    res.status(200).json(users);
});

router.get('/:id', async (req, res) => {

    let user = await User.findById(req.params.id);
    user = {
        self: '/api/v1/users/' + user.id,
        username: user["username"],
        name: user["name"],
        surname: user["surname"],
        email: user["email"]
    }

    res.status(200).json(user);
});

router.post('', async (req, res) => {
    let username = req.body.username;
    let name = req.body.name;
    let surname = req.body.surname;
    let password = req.body.password;
    let email = req.body.email;

    let user = await User.find({username: username});
    
    if(user.length!==0){
        res.status(404).send("Username already exists");
        return;
    }

    if ( !username || !name || !surname || !password || !email) {
        console.error("Something went wrong! Missing required arguments");
        res.status(400).send("Something went wrong! Missing required arguments");
        return;
    }

    user = new User({
        username: username,
        name: name,
        surname: surname,
        email: email,
        password: password
    });
    
    user = await user.save();

    res.location("/login.html").status(302).send();
})

module.exports = router;