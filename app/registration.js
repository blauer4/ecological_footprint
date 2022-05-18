const express = require('express');
const User = require('./models/user').User;
const router = express.Router();

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