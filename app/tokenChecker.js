const jwt = require("jsonwebtoken")

const tokenChecker = function(req, res, next) {
        
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies["token"];
    if (!token) {
        res.redirect("/login.html");
        return;
    }

    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded){
        if (err) {  // if the token is invalid redirect to the login page
            res.redirect("/login.html");
        }else {
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;