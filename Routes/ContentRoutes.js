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


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

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


router.get('/', (req, res, next) => {
  req.query.user_id = req.query.user_id; 
  return getAllContent(req, res, next);
});

router.get('/:id', getContentById);

router.post('/', (req, res, next) => {
  req.body.user_id = req.body.user_id;
  return createContent(req, res, next);
});

router.put('/:id', updateContent);

router.delete('/:id', deleteContent);

module.exports = router;