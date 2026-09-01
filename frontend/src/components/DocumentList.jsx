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
    <section className="rounded-lg border border-olive-200 bg-cream-50 p-7 shadow-[0_14px_40px_rgba(39,73,61,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-terracotta-400">Seu acervo</p>
          <h2 className="font-display text-xl text-olive-900">Documentos enviados</h2>
        </div>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-olive-100 font-bold text-olive-800">
          {documents.length}
        </span>
      </div>

      {documents.length === 0 ? (
        <p className="mt-6 text-olive-500">Nenhum documento foi enviado ainda.</p>
      ) : (
        <div className="mt-6">
          {documents.map((document) => (
            <article className="flex items-center gap-[14px] border-t border-olive-300 py-4" key={document.id}>
              <div
                className="grid h-12 w-10 shrink-0 place-items-center bg-terracotta-100 text-[0.62rem] font-bold text-terracotta-600"
                aria-hidden="true"
              >
                DOC
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <strong className="truncate text-olive-900">{document.originalName}</strong>
                <span className="text-sm text-olive-500">
                  {formatSize(document.size)} · {formatDate(document.uploadedAt)}
                </span>
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
