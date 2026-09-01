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
    <div className="app-shell">
      <header className="topbar">
        <span className="brand">DMS / arquivo local</span>
        <span className="user-badge">Sessão: {userId}</span>
      </header>
      <main className="content">
        <section className="intro">
          <p className="eyebrow">Document Management System</p>
          <h1>Seu acervo, no lugar certo.</h1>
          <p className="lede">
            Envie arquivos, encontre documentos recentes e baixe o que precisar,
            com armazenamento simples e direto.
          </p>
        </section>

        <label className="user-field">
          Usuário
          <input
            onChange={(event) => setUserId(event.target.value)}
            value={userId}
          />
        </label>

        {errorMessage && <p className="alert" role="alert">{errorMessage}</p>}

        <div className="workspace">
          <UploadComponent disabled={!userId.trim()} onUpload={handleUpload} />
          {isLoading ? (
            <section className="documents-panel"><p className="empty-state">Carregando documentos...</p></section>
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
