"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _url = require('url'); var _url2 = _interopRequireDefault(_url);

var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _Company = require('../schemas/Company'); var _Company2 = _interopRequireDefault(_Company);

class SessionController {
  async store(req, res) {
    const { username, password } = req.body;

    const companyToCheck = await _Company2.default.findOne({ username })
      .populate('logo banner address.city address.neighborhood')
      .select('+password -createdAt -updatedAt');

    if (!companyToCheck) {
      return res.status(403).json({ error: 'Company not found' });
    }

    if (!companyToCheck.checkPassword(password)) {
      return res.status(403).json({ error: 'Password does not match' });
    }

    const company = companyToCheck.toJSON();

    return res.json({
      company,
      token: _jsonwebtoken2.default.sign(
        { _id: company._id, audienceType: 'company' },
        _auth2.default.secret,
        {
          expiresIn: _auth2.default.expiresInCompany,
        }
      ),
    });
  }

  async index(req, res) {
    const { origin } = req.headers;

    if (!origin) {
      return res.status(400).json({ error: 'Invalid client' });
    }

    const { hostname } = new _url2.default.URL(origin);

    const companyToCheck = await _Company2.default.findOne({ domains: hostname })
      .populate('logo banner address.city address.neighborhood')
      .select('-createdAt -updatedAt');

    if (!companyToCheck) {
      return res.status(403).json({ error: 'Company not found' });
    }

    const company = companyToCheck.toJSON();

    return res.json({
      company,
      token: _jsonwebtoken2.default.sign(
        { _id: company._id, audienceType: 'visitor' },
        _auth2.default.secret,
        {
          expiresIn: _auth2.default.expiresInVisitor,
        }
      ),
    });
  }
}

exports. default = new SessionController();
