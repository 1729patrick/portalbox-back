import Immobile from '../schemas/Immobile';

import FindImmobilesService from '../services/FindImmobilesService';
class ImmobileController {
  async store(req, res) {
    // return res.json(req.body);

    // for (let i = 0; i < 10000; i++) {
    const immobile = await Immobile.create({
      ...req.body,
      company: req.companyId,
    });
    // }
    const {
      _id,
      address,
      type,
      particulars,
      map,
      price,
      owner,
      images,
      config,
      rates,
    } = immobile;

    return res.json({
      _id,
      address,
      type,
      particulars,
      map,
      price,
      owner,
      images,
      config,
      rates,
    });
  }

  async index(req, res) {
    const {
      page,
      sessions,
      finality,
      types,
      neighborhoods,
      limit,
      priceMin,
      priceMax,
      particulars,
    } = req.query;

    const particularsFormatted = particulars ? JSON.parse(particulars) : null;

    const { count, immobiles } = await FindImmobilesService.run({
      page,
      sessions,
      companyId: req.companyId,
      particularLenght: 3,
      imagesLengh: 1,
      finality,
      types,
      neighborhoods,
      limit: Number(limit),
      priceMin,
      priceMax,
      particulars: particularsFormatted,
    });

    return res.json({ count, immobiles });
  }
}

export default new ImmobileController();
