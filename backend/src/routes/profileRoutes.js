const express = require("express");
const router = express.Router();
const { createProfile, updateMyProfile, getMyProfile, browseProfiles, getProfileById } = require("../controllers/profileController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", protect, browseProfiles);
router.get("/me", protect, requireRole("maid"), getMyProfile);
router.post("/", protect, requireRole("maid"), createProfile);
router.put("/me", protect, requireRole("maid"), updateMyProfile);
router.get("/:id", protect, getMyProfile);

module.exports = router;