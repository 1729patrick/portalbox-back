"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _City = require('../schemas/City'); var _City2 = _interopRequireDefault(_City);
var _Neighborhood = require('../schemas/Neighborhood'); var _Neighborhood2 = _interopRequireDefault(_Neighborhood);

class CreateCityService {
  async run({ name, neighborhoods, companyId }) {
    const checkCityExist = await _City2.default.findOne({ name, company: companyId });

    if (checkCityExist) {
      throw new Error('City alread exist');
    }

    const city = await _City2.default.create({
      name,
      company: companyId,
    });

    city.neighborhoods = await Promise.all(
      neighborhoods.map(name => _Neighborhood2.default.create({ name }))
    );

    await city.save();

    neighborhoods = city.neighborhoods.map(({ _id, name }) => ({ _id, name }));

    return {
      _id: city._id,
      name,
      neighborhoods,
    };
  }
}

exports. default = new CreateCityService();
