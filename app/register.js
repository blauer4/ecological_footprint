const express = require('express');
const User = require('./models/user').User;
const router = express.Router();

/**
 * @swagger
 * paths:
 *      /api/v2/register:
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
 *                  '409':
 *                      description: Username already exixts
 *                  '400':
 *                      description: A compulsory field is missing
 */

router.post('', async (req, res) => {
    let username = req.body.username;
    let name = req.body.name;
    let surname = req.body.surname;
    let password = req.body.password;
    let email = req.body.email;
    let friends = []; // initially a user have no friend

    let user = await User.find({ username: username });

    if (user.length !== 0) {
        res.status(409).send("Username already exists");
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
        password: password,
        friends: friends,
        totalImpact: 0
    });

    user = await user.save();

    res.location("/login.html").status(302).send();
});

module.exports = router;