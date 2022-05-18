const express = require('express');
const User = require('./models/user').User;
const router = express.Router();

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