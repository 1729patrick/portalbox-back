import Type from '../schemas/Type';

class TypeController {
  async store(req, res) {
    const checkNameExists = await Type.findOne({
      company: req.companyId,
      name: req.body.name,
    });

    if (checkNameExists) {
      return res.status(400).json({ error: 'Name alread exists' });
    }

    let type = await Type.create({ ...req.body, company: req.companyId });
    type = await type.populate('image').execPopulate();

    const { _id, name, image } = type.toJSON();

    return res.json({ _id, name, image });
  }

  async index(req, res) {
    const types = await Type.find(
      { company: req.companyId, active: true },
      'name'
    ).populate('image');

    return res.json(types);
  }
}

export default new TypeController();
