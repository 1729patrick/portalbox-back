import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

import Company from '../schemas/Company';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { username, password } = req.body;

    const company = await Company.findOne({ username });

    if (!company) {
      return res.status(401).json({ error: 'Company not found' });
    }

    if (!company.checkPassword(password)) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { _id, name, creci, phones, emails, address, officeHours } = company;

    return res.json({
      company: {
        name,
        creci,
        phones,
        emails,
        address,
        officeHours,
      },
      token: jwt.sign({ _id, audienceType: 'company' }, authConfig.secret, {
        expiresIn: authConfig.expiresInCompany,
      }),
    });
  }

  async index(req, res) {
    const { domain } = req.headers;

    const company = await Company.findOne({ domains: domain });

    if (!company) {
      return res.status(404).json({ erro: 'Company not found' });
    }
    const { _id, name, creci, phones, emails, address, officeHours } = company;

    return res.json({
      company: { _id, name, creci, phones, emails, address, officeHours },
      token: jwt.sign({ _id, audienceType: 'visitor' }, authConfig.secret, {
        expiresIn: authConfig.expiresInVisitor,
      }),
    });
  }
}

export default new SessionController();
