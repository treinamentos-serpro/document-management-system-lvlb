import DownloadButton from './DownloadButton.jsx';

function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function DocumentList({ documents, userId, onDownloadError }) {
  return (
    <section className="documents-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Seu acervo</p>
          <h2>Documentos enviados</h2>
        </div>
        <span className="document-count">{documents.length}</span>
      </div>

      {documents.length === 0 ? (
        <p className="empty-state">Nenhum documento foi enviado ainda.</p>
      ) : (
        <div className="document-list">
          {documents.map((document) => (
            <article className="document-row" key={document.id}>
              <div className="document-icon" aria-hidden="true">DOC</div>
              <div className="document-details">
                <strong>{document.originalName}</strong>
                <span>{formatSize(document.size)} · {formatDate(document.uploadedAt)}</span>
              </div>
              <DownloadButton
                documentId={document.id}
                onError={onDownloadError}
                userId={userId}
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
