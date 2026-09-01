const API_PREFIX = '/api';

async function parseResponse(response) {
  if (response.ok) {
    return response;
  }

  const payload = await response.json().catch(() => null);
  const error = new Error(payload?.error?.message || 'Não foi possível concluir a operação.');
  error.code = payload?.error?.code || 'REQUEST_FAILED';
  error.status = response.status;
  throw error;
}

export async function uploadDocument(userId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    headers: { 'X-User-Id': userId },
    body: formData,
  });

  await parseResponse(response);
  return response.json();
}

export async function listDocuments(userId) {
  const response = await fetch(`${API_PREFIX}/documents`, {
    headers: { 'X-User-Id': userId },
  });

  await parseResponse(response);
  return response.json();
}

export async function downloadDocument(userId, documentId) {
  const response = await fetch(`${API_PREFIX}/documents/${encodeURIComponent(documentId)}/download`, {
    headers: { 'X-User-Id': userId },
  });

  await parseResponse(response);
  return {
    blob: await response.blob(),
    fileName: getFileName(response.headers.get('Content-Disposition')),
  };
}

function getFileName(contentDisposition) {
  if (!contentDisposition) {
    return 'documento';
  }

  const encodedName = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encodedName) {
    return decodeURIComponent(encodedName);
  }

  return contentDisposition.match(/filename="?([^";]+)"?/i)?.[1] || 'documento';
}
