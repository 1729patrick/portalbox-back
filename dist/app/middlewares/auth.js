"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _util = require('util');

var _Company = require('../schemas/Company'); var _Company2 = _interopRequireDefault(_Company);

var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);

exports. default = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [_, token] = authorization.split(' ');

  try {
    const { _id, audienceType } = await _util.promisify.call(void 0, _jsonwebtoken2.default.verify)(
      token,
      _auth2.default.secret
    );

    const role = req._parsedUrl.pathname.split('/')[1];

    if (audienceType === 'visitor' && role !== 'public') {
      return res.status(403).json({ error: "You don't have permission" });
    }

    const companies = await _Company2.default.countDocuments({ _id });

    if (companies !== 1) {
      return res.status(401).json({ error: 'Company not found' });
    }

    req.companyId = _id;

    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
