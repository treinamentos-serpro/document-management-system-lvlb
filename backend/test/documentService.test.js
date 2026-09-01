const { test } = require('node:test');
const assert = require('node:assert');
const { buildDocumentService } = require('../src/services/documentService');
const { createInMemoryDocumentRepository } = require('../src/repositories/inMemoryDocumentRepository');

function createFile(overrides = {}) {
  return {
    originalname: 'documento.pdf',
    size: 512,
    path: '/tmp/documento.pdf',
    ...overrides
  };
}

test('saveDocument cria metadados sem expor o caminho interno do arquivo', () => {
  const repository = createInMemoryDocumentRepository();
  const documentService = buildDocumentService({
    documentRepository: repository,
    generateId: () => 'doc-1',
    now: () => '2026-09-01T00:00:00.000Z'
  });

  const savedDocument = documentService.saveDocument({
    file: createFile(),
    owner: 'lucia'
  });

  assert.deepStrictEqual(savedDocument, {
    id: 'doc-1',
    originalName: 'documento.pdf',
    size: 512,
    uploadedAt: '2026-09-01T00:00:00.000Z',
    owner: 'lucia'
  });
  assert.strictEqual(repository.findById('doc-1').storagePath, '/tmp/documento.pdf');
});

test('listDocuments reutiliza a serialização e permite filtrar por owner', () => {
  const repository = createInMemoryDocumentRepository();
  const documentService = buildDocumentService({
    documentRepository: repository,
    generateId: (() => {
      let index = 0;
      return () => `doc-${++index}`;
    })(),
    now: () => '2026-09-01T00:00:00.000Z'
  });

  documentService.saveDocument({
    file: createFile({ originalname: 'a.pdf', path: '/tmp/a.pdf' }),
    owner: 'lucia'
  });
  documentService.saveDocument({
    file: createFile({ originalname: 'b.pdf', path: '/tmp/b.pdf' }),
    owner: 'maria'
  });

  assert.deepStrictEqual(documentService.listDocuments({ owner: 'lucia' }), [
    {
      id: 'doc-1',
      originalName: 'a.pdf',
      size: 512,
      uploadedAt: '2026-09-01T00:00:00.000Z',
      owner: 'lucia'
    }
  ]);
});

test('getDocumentDownload retorna metadados públicos e caminho do arquivo', () => {
  const repository = createInMemoryDocumentRepository();
  const documentService = buildDocumentService({
    documentRepository: repository,
    generateId: () => 'doc-1',
    now: () => '2026-09-01T00:00:00.000Z'
  });

  documentService.saveDocument({
    file: createFile(),
    owner: 'lucia'
  });

  assert.deepStrictEqual(documentService.getDocumentDownload({
    id: 'doc-1',
    owner: 'lucia'
  }), {
    document: {
      id: 'doc-1',
      originalName: 'documento.pdf',
      size: 512,
      uploadedAt: '2026-09-01T00:00:00.000Z',
      owner: 'lucia'
    },
    path: '/tmp/documento.pdf'
  });
});

test('getDocumentDownload retorna null para documento inexistente ou sem permissão', () => {
  const repository = createInMemoryDocumentRepository();
  const documentService = buildDocumentService({
    documentRepository: repository,
    generateId: () => 'doc-1',
    now: () => '2026-09-01T00:00:00.000Z'
  });

  documentService.saveDocument({
    file: createFile(),
    owner: 'lucia'
  });

  assert.strictEqual(documentService.getDocumentDownload({ id: 'doc-2' }), null);
  assert.strictEqual(documentService.getDocumentDownload({ id: 'doc-1', owner: 'maria' }), null);
});
