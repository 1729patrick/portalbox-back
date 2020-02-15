"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});require('dotenv/config');

var _express = require('express'); var _express2 = _interopRequireDefault(_express);
require('express-async-errors');
var _helmet = require('helmet'); var _helmet2 = _interopRequireDefault(_helmet);
var _youch = require('youch'); var _youch2 = _interopRequireDefault(_youch);
var _path = require('path');
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);

var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);

require('./database');

class App {
  constructor() {
    this.server = _express2.default.call(void 0, );

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(_express2.default.json());
    this.server.use(_helmet2.default.call(void 0, ));
    this.server.use(_cors2.default.call(void 0, ));

    this.server.use(
      '/static/files',
      _express2.default.static(_path.resolve.call(void 0, __dirname, '..', 'tmp', 'uploads'))
    );

    this.server.use(
      '/static/core/colors',
      _express2.default.static(_path.resolve.call(void 0, __dirname, '..', 'tmp', 'config', 'colors'))
    );
  }

  routes() {
    this.server.use(_routes2.default);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new (0, _youch2.default)(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error.' });
    });
  }
}

exports. default = new App().server;
