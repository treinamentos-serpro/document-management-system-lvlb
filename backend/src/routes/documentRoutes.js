const express = require('express');
const multer = require('multer');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const documentController = require('../controllers/documentController');
const { DocumentServiceError } = require('../services/documentService');

const storageDirectory = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.resolve(__dirname, '../../storage');
const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;

const upload = multer({
  storage: multer.diskStorage({
    destination: storageDirectory,
    filename: (request, file, callback) => {
      const extensionByMimeType = {
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg',
        'image/png': '.png',
      };
      callback(null, `${randomUUID()}${extensionByMimeType[file.mimetype] || ''}`);
    },
  }),
  limits: { fileSize: maxFileSize },
  fileFilter: (request, file, callback) => {
    const allowedMimeTypes = new Set([
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]);
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new DocumentServiceError(
        'INVALID_FILE_TYPE',
        'Tipo de arquivo não permitido.',
        400,
      ));
    }

    return callback(null, true);
  },
});

const router = express.Router();

router.post(
  '/upload',
  documentController.requireOwner,
  upload.single('file'),
  documentController.upload,
);
router.get('/documents', documentController.list);
router.get('/documents/:id/download', documentController.download);

module.exports = {
  maxFileSize,
  router,
};
