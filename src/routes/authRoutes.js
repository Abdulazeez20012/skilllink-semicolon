const express = require('express');
const { registerUser, loginUser, updateUserProfile, uploadAvatar } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;