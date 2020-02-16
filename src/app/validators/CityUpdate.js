import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      _id: Yup.string().required(),
      name: Yup.string().required(),
      neighborhoods: Yup.array(
        Yup.object().shape({
          _id: Yup.string(),
          name: Yup.string().required(),
        })
      ).required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
