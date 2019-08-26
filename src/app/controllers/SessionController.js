import jwt from 'jsonwebtoken';
import url from 'url';

import authConfig from '../../config/auth';
import Company from '../schemas/Company';

class SessionController {
  async store(req, res) {
    const { username, password } = req.body;

    const companyToCheck = await Company.findOne({ username })
      .populate('logo banner')
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
      token: jwt.sign(
        { _id: company._id, audienceType: 'company' },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresInCompany,
        }
      ),
    });
  }

  async index(req, res) {
    const { origin } = req.headers;

    if (!origin) {
      return res.status(400).json({ error: 'Invalid client' });
    }

    const { hostname } = new url.URL(origin);

    const companyToCheck = await Company.findOne({ domains: hostname })
      .populate('logo banner')
      .select('-createdAt -updatedAt');

    if (!companyToCheck) {
      return res.status(403).json({ error: 'Company not found' });
    }

    const company = companyToCheck.toJSON();

    return res.json({
      company,
      token: jwt.sign(
        { _id: company._id, audienceType: 'visitor' },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresInVisitor,
        }
      ),
    });
  }
}

export default new SessionController();
