import Immobile from '../schemas/Immobile';

import FindImmobilesService from '../services/FindImmobilesService';
class ImmobileController {
  async store(req, res) {
    const {
      address,
      type,
      particulars,
      map,
      price,
      owner,
      images,
      config,
      rates,
    } = req.body;

    // for (let i = 0; i < 10000; i++) {
    const immobile = await Immobile.create({
      address,
      type,
      particulars,
      map,
      price,
      owner,
      images,
      config,
      company: req.companyId,
      rates,
    });
    // }
    const { _id } = immobile;

    return res.json({
      _id,
      address,
      type,
      particulars,
      map,
      price,
      owner,
      config,
      images,
      rates,
    });
  }

  async index(req, res) {
    const { page, sessions, finality, types, neighborhoods } = req.query;

    const { count, immobiles } = await FindImmobilesService.run({
      page,
      sessions,
      companyId: req.companyId,
      particularLenght: 3,
      imagesLengh: 1,
      finality,
      types,
      neighborhoods,
    });

    return res.json({ count, immobiles });
  }
}

export default new ImmobileController();
