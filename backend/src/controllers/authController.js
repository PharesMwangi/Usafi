const jwt = require("jsonwebtoken");
const User = require("../models/User");

const COOKIE_OPTIONS ={
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signToken = (userId) =>
    jwt.sign({ id: userId}, process.env.JWT_SECRET, { expiresIn: "7d" });

// post signup auth
const signup = async (req, res) =>{
    try {
        const { name, email, password, phone, role } = req.body;

        if(!name || !email || ! password || !phone || !role){
            return res.status(400).json({message: "All fields are required"});
        }
        if(!["maid", "employer"]. includes(role)){
            return res.status(400).json({message: "role must be 'maid' or 'employer'"});
        }

        const existing = await User.findOne({email: email.toLowerCase() });
        if(existing){
            return res.status(409).json({message: "An account with this email alreary exists!"});
        }

        const user = await User.create({ name, email, password, phone, role });
        const token = signToken(user._id);

        res.cookie("token", token, COOKIE_OPTIONS);
        res.status(201).json({ user})
    } catch (err) {
        res.status(500).json({message: "Signup Failed!", error: err.message });
    }
};

//login
const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message: "email and password required"});
        }

        const user = await User.findOne({email: email.toLowerCase() });
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({message: "Invalid email or password!"});
        }

        const token = signToken(user._id);
        console.log("LOGIN HANDLER HIT - about to set cookie");
        res.cookie("token", token, COOKIE_OPTIONS);
        res.json({ user });
    } catch (err) {
        res.status(500).json({message: "Login failed", error: err.message});
    }
};

//logout
const logout = async (req, res) =>{
    res.clearCookie("token", {...COOKIE_OPTIONS, maxAge: undefined});
    res.json({ message: "Logged Out"});
};

//get me
const getMe = async (req, res) =>{
    res.json({ user: req.user });
};

module.exports = { signup, login, logout, getMe };