"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _City = require('../schemas/City'); var _City2 = _interopRequireDefault(_City);

var _CreateCityService = require('../services/CreateCityService'); var _CreateCityService2 = _interopRequireDefault(_CreateCityService);
class CityController {
  async store(req, res) {
    const { name, neighborhoods } = req.body;

    const city = await _CreateCityService2.default.run({
      name,
      neighborhoods,
      companyId: req.companyId,
    });

    return res.json(city);
  }

  async index(req, res) {
    const cities = await _City2.default.find({ company: req.companyId }, 'name').populate(
      {
        path: 'neighborhoods',
        select: 'name',
      }
    );

    return res.json(cities);
  }
}

exports. default = new CityController();
