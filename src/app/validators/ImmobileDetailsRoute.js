export default async (req, res, next) => {
  const { _id } = req.params;
  const path = req._parsedUrl.pathname;
  req._parsedUrl.pathname = path.replace(_id, '_id');
  console.log('bb', req._parsedUrl.pathname);
  next();
};
