import jwt from 'jsonwebtoken';
import { promisify } from 'util';

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

    const whiteRouter = route.includes(whiteRouters);

    if (
      audienceType !== 'company' &&
      (audienceType === 'visitor' && !whiteRouter)
    ) {
      return res.status(403).json({ error: "You don't have permission" });
    }

    req.companyId = _id;

    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
