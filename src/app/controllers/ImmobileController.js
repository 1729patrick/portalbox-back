import Immobile from '../schemas/Immobile';

class ImmobileController {
  async store(req, res) {
    const immobile = await Immobile.create({
      ...req.body,
      company: req.companyId,
    });

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
