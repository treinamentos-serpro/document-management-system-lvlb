function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return response.status(413).json({
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'O arquivo excede o limite permitido de 10 MB.',
      },
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE' || error instanceof SyntaxError) {
    return response.status(400).json({
      error: {
        code: 'INVALID_MULTIPART_REQUEST',
        message: 'A requisição de upload é inválida.',
      },
    });
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message = statusCode >= 500
    ? 'Ocorreu um erro interno.'
    : error.message;

  return response.status(statusCode).json({
    error: { code, message },
  });
}

module.exports = errorHandler;
