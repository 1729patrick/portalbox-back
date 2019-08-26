import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      address: Yup.object().shape({
        street: Yup.string().required(),
        number: Yup.number(),
        neighborhood: Yup.string().required(),
        city: Yup.string().required(),
      }),
      type: Yup.string().required(),
      particulars: Yup.array(
        Yup.object().shape({
          title: Yup.string().required(),
          value: Yup.string().required(),
          icon: Yup.string(),
        })
      ),
      map: Yup.object().shape({
        lat: Yup.number().required(),
        lng: Yup.number().required(),
      }),
      price: Yup.object()
        .shape({
          sale: Yup.number(),
          rent: Yup.number(),
        })
        .required(),
      images: Yup.array(),
      owner: Yup.object().shape({
        name: Yup.string(),
        whatsapp: Yup.string(),
        cpf: Yup.string(),
        annotation: Yup.string(),
      }),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
