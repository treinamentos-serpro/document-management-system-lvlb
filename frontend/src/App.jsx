import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { listDocuments, uploadDocument } from './services/api.js';
import './App.css';

export default function App() {
  const [userId, setUserId] = useState('usuario-demo');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDocuments() {
      setIsLoading(true);
      try {
        const loadedDocuments = await listDocuments(userId);
        if (isMounted) {
          setDocuments(loadedDocuments);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDocuments();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  async function handleUpload(file) {
    try {
      await uploadDocument(userId, file);
      setDocuments(await listDocuments(userId));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-olive-50">
      <header className="flex items-center justify-between border-b border-olive-200 px-6 py-6 md:px-16 lg:px-[88px]">
        <span className="font-display font-bold tracking-wide text-olive-900">DMS / arquivo local</span>
        <span className="text-sm text-olive-600">Sessão: {userId}</span>
      </header>
      <main className="mx-auto w-[min(1050px,calc(100%-48px))] py-12 md:py-24">
        <section className="mb-10 max-w-2xl">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-terracotta-400">
            Document Management System
          </p>
          <h1 className="font-display text-4xl leading-none tracking-tight text-olive-900 sm:text-5xl md:text-7xl lg:text-8xl">
            Seu acervo, no lugar certo.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-olive-600">
            Envie arquivos, encontre documentos recentes e baixe o que precisar,
            com armazenamento simples e direto.
          </p>
        </section>

        <label className="mb-8 block text-sm font-medium text-olive-700">
          Usuário
          <input
            className="mt-1.5 block w-full max-w-sm rounded-md border border-olive-200 bg-cream-50 px-3 py-2 text-olive-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
            onChange={(event) => setUserId(event.target.value)}
            value={userId}
          />
        </label>

        {errorMessage && (
          <p
            className="mb-5 border-l-4 border-terracotta-400 bg-terracotta-50 px-4 py-3 text-terracotta-800"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <div className="grid gap-[18px] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <UploadComponent disabled={!userId.trim()} onUpload={handleUpload} />
          {isLoading ? (
            <section className="rounded-lg border border-olive-200 bg-cream-50 p-7 shadow-[0_14px_40px_rgba(39,73,61,0.08)]">
              <p className="text-olive-500">Carregando documentos...</p>
            </section>
          ) : (
            <DocumentList
              documents={documents}
              onDownloadError={(error) => setErrorMessage(error.message)}
              userId={userId}
            />
          )}
        </div>
      </main>
    </div>
  );
}
