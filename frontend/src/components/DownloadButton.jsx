import { useState } from 'react';
import { downloadDocument } from '../services/api.js';

export default function DownloadButton({ documentId, userId, onError }) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const { blob, fileName } = await downloadDocument(userId, documentId);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      onError(error);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <button
      className="border-0 bg-transparent py-2 pl-2.5 font-bold text-terracotta-400 transition-colors hover:text-terracotta-700 disabled:cursor-wait disabled:opacity-55"
      disabled={isDownloading}
      onClick={handleDownload}
      type="button"
    >
      {isDownloading ? 'Baixando...' : 'Baixar'}
    </button>
  );
}
