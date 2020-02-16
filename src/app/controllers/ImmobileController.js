import Immobile from '../schemas/Immobile';

import FindImmobilesService from '../services/FindImmobilesService';
class ImmobileController {
  async index(req, res) {
    let { particulars } = req.query;

    if (particulars) {
      particulars = JSON.parse(req.query.particulars);
    }

    const { count, immobiles } = await FindImmobilesService.run({
      ...req.query,
      particulars,
      particularLenght: 3,
      imagesLengh: 1,
      limit: Number(req.query.limit),
      companyId: req.companyId,
    });

    return res.json({ count, immobiles });
  }

  async store(req, res) {
    const immobile = await Immobile.create({
      ...req.body,
      company: req.companyId,
    });

    // eslint-disable-next-line no-unused-vars
    const { createdAt, updatedAt, __v, ...restImmobile } = immobile.toObject();

    return res.json(restImmobile);
  }
}

export default new ImmobileController();
