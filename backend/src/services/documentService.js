const { randomUUID } = require('node:crypto');
const { createDocumentRecord } = require('./documentRecordFactory');
const { toDocumentSummary } = require('./documentSerializer');

function buildDocumentService({
  documentRepository,
  generateId = randomUUID,
  now = () => new Date().toISOString()
}) {
  if (!documentRepository) {
    throw new Error('Document repository is required');
  }

  function saveDocument({ file, owner }) {
    const documentRecord = createDocumentRecord({
      id: generateId(),
      file,
      owner,
      uploadedAt: now()
    });

    const savedDocument = documentRepository.save(documentRecord);

    return toDocumentSummary(savedDocument);
  }

  function listDocuments({ owner } = {}) {
    return documentRepository.list({ owner }).map(toDocumentSummary);
  }

  function getDocumentDownload({ id, owner } = {}) {
    const documentRecord = documentRepository.findById(id);

    if (!documentRecord || !owner || documentRecord.owner !== owner) {
      return null;
    }

    return {
      document: toDocumentSummary(documentRecord),
      path: documentRecord.storagePath
    };
  }

  return {
    saveDocument,
    listDocuments,
    getDocumentDownload
  };
}

module.exports = {
  buildDocumentService
};
