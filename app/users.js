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
 *          put: 
 *              summary: Update user
 *              description: This function allows the update of an existing user with all the specified parameters. Requires authentication
 *              requestBody:
 *                  required: true
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  name:
 *                                      type: string
 *                                      description: The name of the user 
 *                                  surname:
 *                                      type: string
 *                                      description: The surname of the user 
 *                                  username:
 *                                      type: string
 *                                      description: The username of the user
 *                                  email:
 *                                      type: string
 *                                      description: The email of the user
 *              responses:
 *                  '200':
 *                      description: The user has been correctly updated
 *                  '422':
 *                      description: Missing parameter
 *                  '409':
 *                      description: Username already exists
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
        email: user["email"],
        totalImpact: user["totalImpact"]
    }

    res.status(200).json(user);
});

router.put('', async (req, res) => {
    let username = req.body.username;
    let name = req.body.name;
    let surname = req.body.surname;
    let email = req.body.email;
    let userId = req.loggedUser.id;

    if (!username || !name || !surname || !email) {
        console.error("Something went wrong! Missing required arguments");
        res.status(422).send("Something went wrong! Missing required arguments");
        return;
    }

    let user_present = await User.find({ username: username });

    if ((user_present.length !== 0) && (userId!==user_present[0]._id.toString())) {
        res.status(409).json({success: false, message: "Username already exists"}).send();
        return;
    }
    
    await User.findByIdAndUpdate(userId,{
        username: username,
        name: name,
        surname: surname,
        email: email
    });
    
    res.location("/api/v1/users").json({success: true}).status(200).send();
});

module.exports = router;