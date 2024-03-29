import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      creci: Yup.string(),
      phones: Yup.array(
        Yup.object().shape({
          number: Yup.string().required(),
          type: Yup.object()
            .shape({
              _id: Yup.string().required(),
              name: Yup.string().required(),
            })
            .required(),
          description: Yup.string().required(),
        })
      ),
      emails: Yup.array(
        Yup.object().shape({
          email: Yup.string().required(),
          type: Yup.object()
            .shape({
              _id: Yup.string().required(),
              name: Yup.string().required(),
            })
            .required(),
          showInPortal: Yup.bool().required(),
        })
      ),
      address: Yup.object()
        .shape({
          street: Yup.string().required(),
          number: Yup.number(),
          neighborhood: Yup.string(), // required for update
          city: Yup.string(), // required for update
          cep: Yup.string().required(),
          lat: Yup.number(),
          lng: Yup.number(),
        })
        .required(),
      logo: Yup.string(), // required for update
      banner: Yup.string(), // required for update
      officeHours: Yup.string(),
      description: Yup.string().required(),
      domains: Yup.array(Yup.string()).required(),
      username: Yup.string().required(),
      password: Yup.string().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
