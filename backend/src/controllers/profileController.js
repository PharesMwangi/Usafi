const MaidProfile = require("../models/Maidprofile");

//create a profile
const createProfile = async (req, res ) =>{
    try {
        const existing = await MaidProfile.findOne({ user: req.user._id});
        if(existing){
            return res.status(409).json({message: "Profile already exists. You can update instead"});
        }

        const{
            photoUrl, county, town, skills, experienceYears,
             bio, availability, expectedPayMin, expectedPayMax,
        } = req.body;

        if(!county){
            return res.status(400).json({message: "County is required" });
        }

        const profile = await MaidProfile.create({
            user: req.user._id,
            photoUrl, county, town, skills, experienceYears,
            bio, availability, expectedPayMin, expectedPayMax,
        });

        res.status(201).json({ profile });
    } catch (err) {
        res.status(500).json({ message: "Could not create profile", error: err.message});
    }
};

//update profile
const updateMyProfile = async (req, res) =>{
    try {
        const profile = await MaidProfile.findByIdAndUpdate(
            {user: req.user._id},
            {$set: req.body},
            {new: true, runValidators: true }
        );
        if(!profile){
            return res.status(404).json({message: "No profile found. Create one first"});
        }
        res.json({ profile });
    } catch (err) {
        res.status(500).json({message: "Profile could not be updated.", error: err.message});
    }
};

//fetch profile
const getMyProfile = async (req, res) =>{
    const profile = await MaidProfile.findOne({ user: req.user._id}).populate("user", "name phone email");
    if(!profile){
        return res.status(404).jsom({message: "No profile found"});
    }
    res.json({ profile });
};

//browse profiles with filters
const browseProfiles = async (req, res) =>{
    try {
        const { county, skill, availability, minExperience } = req.query;
        const filter = { isActive: true };

        if(county) filter.county = new RegExp(`^${county}$`, "i");
        if(skill) filter.skills = skill;
        if(availability) filter.availability = availability;
        if(minExperience) filter.experienceYears = { $gte: Number(minExperience) };

        const profiles = await MaidProfile.find(filter)
        .populate("user", "name")
        .sort({ createdAt: -1 });

        res.json({ profiles, count: profiles.length });
    } catch (err) {
        res.status(500).json({message: "Could not fetch profiles", error: err.message});
    }
};

//view full profile
const getProfileById = async (req, res) =>{
    try {
        const profile = await MaidProfile.findById(req.params.id).populate("user", "name phone");
        if(!profile || !profile.isActive){
            return res.status(404).json({message: "Profile not found"});
        }
        res.json({ profile});
    } catch (err) {
        res.status(500).json({message: "Could not fetch profile", error: err.message});
    }
};

module.exports = { createProfile, updateMyProfile, getMyProfile, browseProfiles, getProfileById};