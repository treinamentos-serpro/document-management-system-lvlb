function createDocumentRecord({ id, file, owner, uploadedAt }) {
  if (!file) {
    throw new Error('File is required');
  }

  return {
    id,
    originalName: file.originalname,
    size: file.size,
    uploadedAt,
    owner,
    storagePath: file.path
  };
}

module.exports = {
  createDocumentRecord
};
