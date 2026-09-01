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
    <button className="text-button" disabled={isDownloading} onClick={handleDownload} type="button">
      {isDownloading ? 'Baixando...' : 'Baixar'}
    </button>
  );
}
