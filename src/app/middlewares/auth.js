import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import Company from '../schemas/Company';

import authConfig from '../../config/auth';
import whiteRouters from '../../config/whiteRouters';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [_, token] = authorization.split(' ');

  try {
    const { _id, audienceType } = await promisify(jwt.verify)(
      token,
      authConfig.secret
    );

    const route = `${req.method}#${req._parsedUrl.pathname}`;

    console.log('aa', req._parsedUrl.pathname);
    const whiteRouter = whiteRouters.indexOf(route) !== -1;

    if (
      audienceType !== 'company' &&
      audienceType === 'visitor' &&
      !whiteRouter
    ) {
      return res.status(403).json({ error: "You don't have permission" });
    }

    const companies = await Company.count({ _id });

    if (companies !== 1) {
      return res.status(401).json({ error: 'Company not found' });
    }

    req.companyId = _id;

    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
