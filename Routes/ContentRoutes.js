const express = require('express');
const router = express.Router();

const multer = require('multer');

const {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent
} = require('../controllers/ContentController');


// Upload settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


// Upload file route
router.post(
  '/upload-file',
  upload.single('file'),
  (req, res) => {
    try {
      res.status(201).json({
        message: 'File uploaded successfully',
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


// Existing routes
router.get('/', getAllContent);

router.get('/:id', getContentById);

router.post('/', createContent);

router.put('/:id', updateContent);

router.delete('/:id', deleteContent);

module.exports = router;