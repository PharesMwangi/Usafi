const mongoose = require("mongoose");

const SKILL_OPTIONS = [
    "cooking",
    "childcare",
    "laundry",
    "general_cleaning",
    "elderly_ care",
    "deep_cleaning"
];

const maidProfileSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    photoUrl: {type: String, default: ""},
    county: {type: String, required: true, trim: true},
    town: {type: String, trim: true},
    nationality: {type: String, default: "Kenyan"},
    skills:{
        type: [{type: String, enum: SKILL_OPTIONS}],
        default: [],
    },
    experienceYears: {type: Number, default:0, min: 0},
    bio: {type: String, maxlength: 1000, default: ""},
    availability: {
        type: String,
        enum: ["live_in", "live_out", "either"],
        default: "either",
    },
    expectedPayMin: {type: Number, default: 0},
    expectedPayMax: { type: Number, default: 0},
    isActive: { type: Boolean, default: true},
}, 
    {timestamps: true}
);

maidProfileSchema.index({ county: 1, skills: 1});

module.exports = mongoose.model("MaidProfile", maidProfileSchema);
module.exports.SKILL_OPTIONS = SKILL_OPTIONS;