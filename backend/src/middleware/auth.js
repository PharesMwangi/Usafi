const jwt = require("jsonwebtoken");
const User = require("../models/User");

//protect routes - requires valid jwt
const protect = async (req, res, next) =>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({message: "User no longer exists"});
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid or expired token"});
    }
};

//restrict route to specific role
const requireRole = (role) => (req, res, next) =>{
    if(req.user.role !== role){
        return res.status(403).json({message:`Only ${role} accounts can do this`});
    }
    next();
};

module.exports = {protect, requireRole};