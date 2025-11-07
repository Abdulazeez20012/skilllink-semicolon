const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for avatar uploads (more permissive)
const avatarFileFilter = (req, file, cb) => {
  // Accept common image types for avatars
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed for avatars.'), false);
  }
};

// General file filter (for other uploads)
const generalFileFilter = (req, file, cb) => {
  // Accept images, pdfs, and documents
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, PDF, and DOC files are allowed.'), false);
  }
};

// Upload middleware for avatars
const uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: process.env.FILE_SIZE_LIMIT ? 
      parseInt(process.env.FILE_SIZE_LIMIT.replace('mb', '')) * 1024 * 1024 : 
      10 * 1024 * 1024 // 10MB default
  },
  fileFilter: avatarFileFilter
});

// General upload middleware
const uploadGeneral = multer({
  storage: storage,
  limits: {
    fileSize: process.env.FILE_SIZE_LIMIT ? 
      parseInt(process.env.FILE_SIZE_LIMIT.replace('mb', '')) * 1024 * 1024 : 
      10 * 1024 * 1024 // 10MB default
  },
  fileFilter: generalFileFilter
});

module.exports = {
  avatar: uploadAvatar,
  general: uploadGeneral
};