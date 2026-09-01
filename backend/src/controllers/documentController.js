const documentService = require('../services/documentService');

function getOwner(request) {
  const owner = request.get('X-User-Id');
  if (!owner || !owner.trim() || owner.includes('\n') || owner.includes('\r')) {
    const error = new documentService.DocumentServiceError(
      'USER_ID_REQUIRED',
      'O identificador do usuário é obrigatório.',
      400,
    );
    throw error;
  }

  return owner.trim();
}

function requireOwner(request, response, next) {
  try {
    getOwner(request);
    next();
  } catch (error) {
    next(error);
  }
}

async function upload(request, response, next) {
  try {
    const owner = getOwner(request);
    const document = await documentService.uploadDocument(request.file, owner);
    response.status(201).json(document);
  } catch (error) {
    next(error);
  }
}

function list(request, response, next) {
  try {
    const owner = getOwner(request);
    response.json(documentService.listDocuments(owner));
  } catch (error) {
    next(error);
  }
}

async function download(request, response, next) {
  try {
    const owner = getOwner(request);
    const { content, document } = await documentService.downloadDocument(request.params.id, owner);
    response.type(document.mimeType);
    response.attachment(document.originalName);
    response.send(content);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  download,
  getOwner,
  list,
  requireOwner,
  upload,
};
