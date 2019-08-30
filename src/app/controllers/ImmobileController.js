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
    });
  }

  async index(req, res) {
    const { page, sessions } = req.query;

    const { count, immobiles } = await FindImmobilesService.run({
      page,
      sessions,
      companyId: req.companyId,
    });

    return res.json({ count, immobiles });
  }
}

export default new ImmobileController();
