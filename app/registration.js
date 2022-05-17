const express = require('express');
const User = require('./models/user').User;
const router = express.Router();

router.get('/:id', async (req,res) => {
    let user = await User.findById(req.params.id);
    product = {
        self: '/api/v1/user/' + user.id,
        name: user["name"],
        cognome: user["cognome"],
        email: user["email"]
    }

    res.status(200).json(user);
});

router.post('', async (req, res) => {
    let usern = req.body.username;
    let nome_ = req.body.nome;
    let cognome_ = req.body.cognome;
    let username_ = req.body.username;
    let password_ = req.body.password;
    let email_ = req.body.email;

    let user = await User.find({username: usern});
    
    if(user.length!==0){
        res.status(404).send("Username already exists");
        return;
    }

    if (!usern || !nome_ || !cognome_ || !username_ || !email_) {
        console.error("Something went wrong! Missing required arguments");
        res.status(404).send("Something went wrong! Missing required arguments");
        return;
    }

    user = new User({
        username: usern,
        nome: nome_,
        cognome: cognome_,
        email: email_,
        password: password_,
    });

    user = await user.save();

    res.location("/api/v1/register/" + user._id).status(201).send();
})

module.exports = router;