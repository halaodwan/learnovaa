const express = require("express");
const router = express.Router();

<<<<<<< Updated upstream
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const AdmZip = require('adm-zip');
=======
const multer = require("multer");
const fs = require("fs");
>>>>>>> Stashed changes

const {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent
} = require("../controllers/ContentController");


const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

<<<<<<< Updated upstream
const stripXml = (xml) => {
  return xml
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

const extractPptxText = (filePath) => {
  const zip = new AdmZip(filePath);
  const slideEntries = zip
    .getEntries()
    .filter((entry) =>
      /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName)
    )
    .sort((a, b) => a.entryName.localeCompare(b.entryName, undefined, {
      numeric: true,
    }));

  return slideEntries
    .map((entry) => stripXml(entry.getData().toString('utf8')))
    .filter(Boolean)
    .join('\n\n');
};

const extractFileText = async (filePath, originalName, mimetype) => {
  const extension = path.extname(originalName).toLowerCase();

  if (extension === '.pdf' || mimetype === 'application/pdf') {
    const buffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();
    return data.text.trim();
  }

  if (
    extension === '.docx' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value.trim();
  }

  if (
    extension === '.pptx' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return extractPptxText(filePath);
  }

  if (['.txt', '.md', '.csv'].includes(extension)) {
    const text = await fs.readFile(filePath, 'utf8');
    return text.trim();
  }

  return '';
};

router.post(
  '/upload-file',
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const extractedText = await extractFileText(
        req.file.path,
        req.file.originalname,
        req.file.mimetype
      );

      res.status(201).json({
        message: 'File uploaded successfully',
        fileName: req.file.filename,
        originalName: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
        extractedText,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
=======


router.post("/upload-file", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
>>>>>>> Stashed changes
      });
    }

    res.status(201).json({
      message: "File uploaded successfully",
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});



router.get("/", (req, res, next) => {
  req.query.user_id = req.query.user_id;
  return getAllContent(req, res, next);
});

router.get("/:id", getContentById);

router.post("/", (req, res, next) => {
  req.body.user_id = req.body.user_id;
  return createContent(req, res, next);
});

router.put("/:id", updateContent);

router.delete("/:id", deleteContent);

module.exports = router;
