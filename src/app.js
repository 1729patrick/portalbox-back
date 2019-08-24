import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
import { resolve } from 'path';
import cors from 'cors';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());

    this.server.use(
      '/static/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    this.server.use(
      '/static/core/colors',
      express.static(resolve(__dirname, '..', 'tmp', 'config', 'colors'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      // if (process.env.NODE_ENV === 'development') {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
      // }

      return res.status(500).json({ error: 'Internal server error.' });
    });
  }
}

export default new App().server;
