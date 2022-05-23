const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user').User;
const router = express.Router();

/**
 * @swagger
 * paths:
 *      /api/v1/login/logout:
 *          get:
 *              summary: Logs out an user from the current session
 *              responses:
 *                  '200':
 *                      description: Returns an answer that the user successfully logged out
 *      /api/v1/login:
 *          post:
 *              summary: Gets a new login request
 *              description: Login an account if a match is found in the database
 *              requestBody:
 *                  required: true
 *                  content: 
 *                      application/x-www-form-urlencoded:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  email: 
 *                                      type: string
 *                                      description: The email of the user
 *                                  password:
 *                                      type: string
 *                                      description: The password of the user
 *                          example:
 *                              description: An example of a request
 *                              value:
 *                                  email: example@example.com
 *                                  password: 12345
 *              responses:
 *                  '200':
 *                      description: Returns the jwt token in case of success, otherwise a message error
 *                      content:
 *                          application/json:
 *                              type: object
 *                              properties: 
 *                                  success:
 *                                      type: boolean
 *                                      description: If the response was successfull
 *                                  message: 
 *                                      type: string
 *                                      description: The message of success or the message of what I got wrong
 */

router.get('/logout',async function(req,res){
	res.clearCookie('token', { path: '/' });
	res.clearCookie('userId', { path: '/' });
	res.status(200).send("Successfully logged out");
});

router.post('', async function(req, res) {
    
	let user = await User.findOne({
		email: req.body.email
	}).exec();
	
	if (!user) {
		res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
        return;
	}
	
	if (user.password != req.body.password) {
		res.status(404).json({ success: false, message: 'Authentication failed. Wrong password.' });
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
        success: true,
		token: token,
		userId: user._id
	});

});

module.exports = router;