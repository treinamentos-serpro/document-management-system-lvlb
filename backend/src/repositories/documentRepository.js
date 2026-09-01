const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const storageDirectory = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.resolve(__dirname, '../../storage');

const documents = new Map();

async function create(file, owner) {
  const id = randomUUID();
  const document = {
    id,
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
    mimeType: file.mimetype,
    storedName: file.filename,
  };

  documents.set(id, document);
  return toPublicDocument(document);
}

function listByOwner(owner) {
  return [...documents.values()]
    .filter((document) => document.owner === owner)
    .sort((first, second) => second.uploadedAt.localeCompare(first.uploadedAt))
    .map(toPublicDocument);
}

function findByOwner(id, owner) {
  const document = documents.get(id);
  if (!document || document.owner !== owner) {
    return null;
  }

  return { ...document };
}

async function readFile(document) {
  return fs.readFile(path.join(storageDirectory, document.storedName));
}

async function removeStoredFile(file) {
  if (!file?.path) {
    return;
  }

  await fs.rm(file.path, { force: true });
}

function toPublicDocument(document) {
  return {
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  };
}

module.exports = {
  create,
  findByOwner,
  listByOwner,
  readFile,
  removeStoredFile,
};
