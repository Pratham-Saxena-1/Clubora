const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = 'uploads/';
    if (file.fieldname === 'logo') dest += 'logos/';
    else if (file.fieldname === 'profilePic') dest += 'profile-pics/';
    else if (file.fieldname === 'resume') dest += 'resumes/';
    else if (file.fieldname === 'qrTicket') dest += 'event-qr/';
    else if (file.fieldname === 'certificateFile') dest += 'certificates/';
    else if (file.fieldname === 'teamMemberPhoto') dest += 'team-members/';
    else if (file.fieldname === 'galleryImage') dest += 'gallery/';
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF allowed for resume'), false);
    }
  } else if (file.fieldname === 'certificateFile') {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF or images allowed for certificates'), false);
    }
  } else {
    // Images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = upload;
