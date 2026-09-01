function toDocumentSummary(documentRecord) {
  if (!documentRecord) {
    return null;
  }

  return {
    id: documentRecord.id,
    originalName: documentRecord.originalName,
    size: documentRecord.size,
    uploadedAt: documentRecord.uploadedAt,
    owner: documentRecord.owner
  };
}

module.exports = {
  toDocumentSummary
};
