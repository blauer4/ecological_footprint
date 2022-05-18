const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user').User;
const router = express.Router();

router.get('/logout',async function(req,res){
	res.clearCookie('token', { path: '/' });
	res.status(200).send("Successfully logged out");
});

router.post('', async function(req, res) {
    
	let user = await User.findOne({
		email: req.body.email
	}).exec();
	
	if (!user) {
		res.json({ success: false, message: 'Authentication failed. User not found.' });
        return;
	}
	
	if (user.password != req.body.password) {
		res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        return;
	}
	
	var payload = {
		email: user.email,
		id: user._id
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.json({
		token: token,
		userId: user._id
	});

});

module.exports = router;