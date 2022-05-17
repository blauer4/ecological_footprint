const jwt = require("jsonwebtoken")

const tokenChecker = function(req, res, next) {
    
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) res.redirect("login.html").json({success:false, message:'No token provided.'});

    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded){
        if (err) res.status(403).json({success:false, message:'Token not valid'})
        else {
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;