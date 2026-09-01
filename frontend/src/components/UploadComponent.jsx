import { useState } from 'react';

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png';

export default function UploadComponent({ onUpload, disabled = false }) {
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file || disabled) {
      return;
    }

    setIsSending(true);
    try {
      await onUpload(file);
      setFile(null);
      event.target.reset();
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="upload-panel" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Adicionar arquivo</p>
        <h2>Envie um novo documento</h2>
        <p className="muted">PDF, JPG ou PNG com até 10 MB.</p>
      </div>
      <label className="file-picker">
        <span>{file ? file.name : 'Escolher arquivo'}</span>
        <input
          accept={ACCEPTED_TYPES}
          disabled={disabled || isSending}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          type="file"
        />
      </label>
      <button className="primary-button" disabled={!file || disabled || isSending} type="submit">
        {isSending ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}
