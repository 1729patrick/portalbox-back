import Immobile from '../schemas/Immobile';

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

    const sessionsFind = sessions
      ? { 'config.sessions': { $in: JSON.parse(sessions) } }
      : {};

    const findImmobile = () =>
      Immobile.find(
        {
          company: req.companyId,
          ...sessionsFind,
        },
        [
          'address',
          'map',
          'price',
          'images',
          'type',
          'particulars',
          'config.sessions',
        ]
      );

    const count = await findImmobile().count();

    const skip = count > 8 ? Math.random() * count - 8 : Math.random() * count;

    const immobiles = await findImmobile()
      .populate([
        { path: 'address.city', model: 'City', select: 'name' },
        { path: 'address.neighborhood', model: 'Neighborhood', select: 'name' },
        { path: 'type', model: 'Type', select: 'name' },
        { path: 'images.file', model: 'File', select: 'url path' },
      ])
      .skip(skip)
      .limit(8);

    return res.json({ count, immobiles });
  }
}

export default new ImmobileController();
