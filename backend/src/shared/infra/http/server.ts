import 'reflect-metadata';
import express, { Response, NextFunction, Request } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  console.error(err);
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      staus: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    staus: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333);
