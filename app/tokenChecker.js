const jwt = require("jsonwebtoken")

const tokenChecker = function(req, res, next) {
        
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies["token"];
    if (!token) {
        res.redirect("/login.html");
        return;
    }

    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded){
        if (err) res.status(403).json({success:false, message:'Token not valid'})
        else {
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;