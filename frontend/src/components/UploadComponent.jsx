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
    <form
      className="flex flex-col justify-between gap-[26px] rounded-lg border border-olive-200 bg-cream-50 p-7 shadow-[0_14px_40px_rgba(39,73,61,0.08)]"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-terracotta-400">Adicionar arquivo</p>
        <h2 className="font-display text-xl text-olive-900">Envie um novo documento</h2>
        <p className="mt-2 leading-relaxed text-olive-500">PDF, JPG ou PNG com até 10 MB.</p>
      </div>
      <label className="block cursor-pointer rounded-md border border-dashed border-olive-400 p-[18px] text-center text-olive-700 transition-colors hover:border-terracotta-400">
        <span>{file ? file.name : 'Escolher arquivo'}</span>
        <input
          accept={ACCEPTED_TYPES}
          className="mx-auto mt-3 block max-w-full"
          disabled={disabled || isSending}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          type="file"
        />
      </label>
      <button
        className="rounded-[5px] bg-terracotta-400 px-[18px] py-[13px] font-bold text-cream-50 transition-colors hover:bg-terracotta-500 disabled:cursor-wait disabled:opacity-55"
        disabled={!file || disabled || isSending}
        type="submit"
      >
        {isSending ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}
