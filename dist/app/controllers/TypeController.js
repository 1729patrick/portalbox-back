"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Type = require('../schemas/Type'); var _Type2 = _interopRequireDefault(_Type);

class TypeController {
  async store(req, res) {
    const checkNameExists = await _Type2.default.findOne({
      company: req.companyId,
      name: req.body.name,
    });

    if (checkNameExists) {
      return res.status(400).json({ error: 'Name alread exists' });
    }

    let type = await _Type2.default.create({ ...req.body, company: req.companyId });
    type = await type.populate('image').execPopulate();

    const { _id, name, image } = type.toJSON();

    return res.json({ _id, name, image });
  }

  async index(req, res) {
    const types = await _Type2.default.find(
      { company: req.companyId, active: true },
      'name'
    ).populate('image');

    return res.json(types);
  }
}

exports. default = new TypeController();
