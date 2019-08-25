import Type from '../schemas/Type';

class TypeController {
  async store(req, res) {
    const { name, image } = req.body;

    const checkNameExists = await Type.findOne({
      company: req.companyId,
      name,
    });

    if (checkNameExists) {
      return res.status(401).json({ error: 'Name alread exists' });
    }

    const type = await Type.create({ name, image, company: req.companyId });

    const { _id } = type;

    return res.json({ _id, name });
  }

  async index(req, res) {
    let types = await Type.find(
      { company: req.companyId, active: true },
      'name'
    ).populate('image');

    types = types.map(({ _id, name, image }) => ({
      _id,
      name,
      image: image.url,
    }));

    return res.json(types);
  }
}

export default new TypeController();
