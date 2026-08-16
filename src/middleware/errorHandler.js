import { HttpError } from 'http-errors';

export const errorHandler = (error, request, response, next) => {
  console.error('Error Middleware::', error);

  if (error instanceof HttpError) {
    return response.status(error.status).json({
      message: error.message || error.name,
    });
  }

  const isProd = process.env.NODE_ENV === 'production';

  response.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : error.message,
  });
};
