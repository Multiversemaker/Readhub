const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Direktori upload
const uploadDirs = {
  books: path.join(__dirname, "..", "public", "uploads", "books"),
  covers: path.join(__dirname, "..", "public", "uploads", "covers")
};

// Buat folder jika belum ada
Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cover_image") cb(null, uploadDirs.covers);
    else cb(null, uploadDirs.books);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// Allowed extensions
const allowedExt = [
  ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt",
  ".jpg", ".jpeg", ".png", ".webp", ".xlsx", ".xls"
];

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  
  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Tipe atau ekstensi file tidak diizinkan"), false);
  }
};

// Multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = upload;
