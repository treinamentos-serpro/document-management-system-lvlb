function createInMemoryDocumentRepository(initialDocuments = []) {
  const documents = [...initialDocuments];

  function save(documentRecord) {
    documents.push(documentRecord);

    return documentRecord;
  }

  function list({ owner } = {}) {
    if (!owner) {
      return [...documents];
    }

    return documents.filter((documentRecord) => documentRecord.owner === owner);
  }

  function findById(id) {
    return documents.find((documentRecord) => documentRecord.id === id) || null;
  }

  function clear() {
    documents.length = 0;
  }

  return {
    save,
    list,
    findById,
    clear
  };
}

module.exports = {
  createInMemoryDocumentRepository
};
