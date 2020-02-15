import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    Yup.numberNullable = () =>
      Yup.number()
        .transform(cv => (cv >= 0 && typeof cv === 'number' ? cv : null))
        .nullable();

    Yup.addMethod(Yup.object, 'atLeastOneOf', function(list) {
      return this.test({
        name: 'atLeastOneOf',
        // eslint-disable-next-line no-template-curly-in-string
        message: '${path} must have at least one of these keys: ${keys}',
        exclusive: true,
        params: { keys: list.join(', ') },
        test: value => value === null || list.some(f => value[f] !== null),
      });
    });

    const schema = Yup.object().shape({
      address: Yup.object().shape({
        street: Yup.string().required(),
        number: Yup.numberNullable(),
        neighborhood: Yup.object().shape({
          _id: Yup.string().required(),
        }),
        city: Yup.object().shape({
          _id: Yup.string().required(),
        }),
      }),
      type: Yup.string().required(),
      particulars: Yup.array(
        Yup.object().shape({
          title: Yup.string().required(),
          value: Yup.string().required(),
          icon: Yup.string(),
        })
      ),
      map: Yup.object()
        .shape({
          lat: Yup.numberNullable(),
          lng: Yup.numberNullable(),
        })
        .required(),
      price: Yup.object()
        .shape({
          sale: Yup.numberNullable(),
          rent: Yup.numberNullable(),
        })
        .atLeastOneOf(['sale', 'rent']),
      images: Yup.array(
        Yup.object().shape({
          file: Yup.string().required(),
          url: Yup.string().required(),
          description: Yup.string().required(),
        })
      ).required(),
      owner: Yup.object().shape({
        name: Yup.string(),
        whatsapp: Yup.numberNullable(),
        cpf: Yup.string(),
        annotation: Yup.string(),
      }),
      config: Yup.object().shape({
        sessions: Yup.array(Yup.number()),
      }),
      rates: Yup.array(
        Yup.object().shape({
          title: Yup.string().required(),
          value: Yup.numberNullable(),
        })
      ),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
