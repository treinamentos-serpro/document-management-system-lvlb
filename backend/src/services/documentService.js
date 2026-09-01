const documentRepository = require('../repositories/documentRepository');

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
]);

class DocumentServiceError extends Error {
  constructor(code, message, statusCode) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

async function uploadDocument(file, owner) {
  if (!file) {
    throw new DocumentServiceError('FILE_REQUIRED', 'O arquivo é obrigatório.', 400);
  }

  if (!allowedMimeTypes.has(file.mimetype)) {
    await documentRepository.removeStoredFile(file).catch(() => {});
    throw new DocumentServiceError('INVALID_FILE_TYPE', 'Tipo de arquivo não permitido.', 400);
  }

  try {
    return await documentRepository.create(file, owner);
  } catch (error) {
    await documentRepository.removeStoredFile(file).catch(() => {});
    throw new DocumentServiceError('UPLOAD_FAILED', 'Não foi possível concluir o upload.', 500);
  }
}

function listDocuments(owner) {
  return documentRepository.listByOwner(owner);
}

async function downloadDocument(id, owner) {
  const document = documentRepository.findByOwner(id, owner);
  if (!document) {
    throw new DocumentServiceError('DOCUMENT_NOT_FOUND', 'Documento não encontrado.', 404);
  }

  try {
    const content = await documentRepository.readFile(document);
    return { content, document };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new DocumentServiceError('DOCUMENT_NOT_FOUND', 'Documento não encontrado.', 404);
    }

    throw new DocumentServiceError(
      'DOCUMENT_DOWNLOAD_FAILED',
      'Não foi possível baixar o documento.',
      500,
    );
  }
}

module.exports = {
  DocumentServiceError,
  downloadDocument,
  listDocuments,
  uploadDocument,
};
