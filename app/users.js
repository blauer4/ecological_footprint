const express = require('express');
const User = require('./models/user').User;
const router = express.Router();

/**
 * @swagger
 * paths:
 *      /api/v1/users:
 *          get:
 *              summary: Get the list of users 
 *              description: This function retrieves the list of users present in the db and returns it as a json document
 *              responses:
 *                  '200':
 *                      description: The json list of all users present in the db
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties: 
 *                                          self:
 *                                              type: string
 *                                              description: The link to the resource of the user
 *                                          username:
 *                                              type: string
 *                                              description: The username of the user
 *                              example:
 *                                  - self: "/api/v1/users/628367e9078d0308f8dd76ba"
 *                                    username: "lollixzc"
 *          post:
 *              summary: Insertion of a new user
 *              description: This function allows the insertion of a new user with the correct specified params
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
 *              responses:
 *                  '302':
 *                      description: The user has been correctly registered
 *                  '404':
 *                      description: Username already exixts
 *                  '400':
 *                      description: A compulsory field is missing
 *      /api/v1/users/{id}:
 *          get:
 *              summary: Getting a specific User through userId
 *              description: This function retrives a specific user, thanks to the userId you set in the parameters
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    required: true
 *                    description: The id of the correspondent user you would like to search for
 *                    schema: 
 *                      type: string
 *              responses:
 *                  '200':
 *                      description: Returns a link to the resource user requested, and the username of the user
 *                      content: 
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      self:
 *                                          type: string
 *                                          description: The link to the resource of the user
 *                                      username:
 *                                          type: string
 *                                          description: The username of the user
 *                                  example:
 *                                      self: /api/v1/users/{id}
 *                                      username: vittossanna
 */

router.get('', async (req, res) => {

    let users = await User.find({});
    users = users.map((user) => {
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

    let user = await User.find({ username: username });

    if (user.length !== 0) {
        res.status(404).send("Username already exists");
        return;
    }

    if (!username || !name || !surname || !password || !email) {
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
});

router.put('/update_profile', (req, res) => {
    let username = req.body.username;
    let name = req.body.name;
    let surname = req.body.surname;
    let email = req.body.email;
    let userId = req.cookies.userId;

    let user_present = await User.find({ username: username });
    
    if (user_present.length !== 0) {
        res.status(404).json({success: false, message: "Username already exists"}).send();
        return;
    }
    
    User.findByIdAndUpdate(userId,{
        username: username,
        name: name,
        surname: surname,
        email: email
    });

    res.location("/api/v1/users/update_profile").json({success: true}).status(200).send();
});

module.exports = router;