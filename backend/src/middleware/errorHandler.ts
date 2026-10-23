import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = typeof err?.status === 'number' ? err.status : 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: {
      status,
      message: status >= 500 ? 'Unexpected server error' : err.message,
    },
  });
};
