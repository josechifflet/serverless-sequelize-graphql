import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import v1Routes from './apiV1/index';
import { internalServerError, notFound } from './utils/errorHandler';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import path from 'path';
import { environment } from '../environment/environments';

const corsOptions = {
  origin: (origin, callback) => {
    if (!environment.APP) {
      return callback(null, true)
    }
    if (environment.APP !== origin) {
      return callback(new Error('Not found'), false)
    }
    return callback(null, true)
  },
  credentials: true,
  allowedHeaders: [
    'Save-Data',
    'Content-Type',
    'Authorization',
    'Content-Length',
    'X-Requested-With',
    'Accept',
  ],
}

export const App = (): express.Application => {
  const app: express.Application = express();
  app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, '../public')));
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  app.use(notFound)
  app.use(internalServerError)

  app.use('/', v1Routes);
  return app;
};
