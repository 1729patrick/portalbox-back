import * as Yup from 'yup';

import Immobile from '../schemas/Immobile';
import Company from '../schemas/Company';

class ImmobileController {
  async store(req, res) {
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

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // let immobile = [];
    // for (let i = 0; i < 5000; i++) {
    const immobile = await Immobile.create({
      ...req.body,
      company: req.companyId,
    });
    // }

    const { _id, address, type, particulars, map, price, owner } = immobile;

    return res.json({ _id, address, type, particulars, map, price, owner });
  }

  async index(req, res) {
    const { page } = req.query;

    const immobiles = await Immobile.find(
      { company: req.companyId },
      ['address', 'map', 'price', 'images', 'type', 'particulars'],
      { limit: 1000, skip: (page - 1) * 1000 }
    );

    return res.json(immobiles);
  }
}

export default new ImmobileController();
