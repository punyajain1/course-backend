const jwt = require("jsonwebtoken");
const { JWT_KEY_admin } = require("../config");

function adminMiddleware(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_KEY_admin);
    if(decoded){
        req.userId = decoded.id;
        next();
    }else{
        res.status(403).json({ message: "You are not signed in" });
    }
}

module.exports = {adminMiddleware};