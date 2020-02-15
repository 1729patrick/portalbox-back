"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _FindImmobilesService = require('../services/FindImmobilesService'); var _FindImmobilesService2 = _interopRequireDefault(_FindImmobilesService);

class ImmobileDetailsController {
  async index(req, res) {
    const { _id } = req.params;

    const { immobiles } = await _FindImmobilesService2.default.run({
      _id,
      companyId: req.companyId,
    });

    if (immobiles.length !== 1) {
      return res.status(404).json({ error: 'Immobile not found' });
    }

    return res.json(...immobiles);
  }
}

exports. default = new ImmobileDetailsController();
