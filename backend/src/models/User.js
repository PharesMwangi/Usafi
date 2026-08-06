const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name : {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true, minlength: 6},
    phone: { type: String, required: true, trim: true},
    role: {type: String, enum: ["helper", "employer"], required: true},
}, {timestamps: true}

);

//hash passwords
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    const salt = bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword){
    return bcrypt.compare( candidatePassword, this.password);
};

//never send password hash in api responses
userSchema.methods.tojson = function (){
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("User", userSchema);