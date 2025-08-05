import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      error: err.message,
    });
    return;
  }

  res.json({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
  });
};
