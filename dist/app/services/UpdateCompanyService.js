"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Company = require('../schemas/Company'); var _Company2 = _interopRequireDefault(_Company);

var _Neighborhood = require('../schemas/Neighborhood'); var _Neighborhood2 = _interopRequireDefault(_Neighborhood);
var _City = require('../schemas/City'); var _City2 = _interopRequireDefault(_City);
var _File = require('../schemas/File'); var _File2 = _interopRequireDefault(_File);

class UpdateCompanyService {
  async run({ _id, company }) {
    try {
      const neighborhood = await _Neighborhood2.default.countDocuments({
        _id: company.address.neighborhood,
      });

      if (!neighborhood) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Neighborhood not found');
    }

    try {
      const city = await _City2.default.countDocuments({ _id: company.address.city });

      if (!city) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('City not found');
    }

    try {
      const banner = await _File2.default.countDocuments({ _id: company.banner });

      if (!banner) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Banner not found');
    }

    try {
      const logo = await _File2.default.countDocuments({ _id: company.logo });

      if (!logo) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Logo not found');
    }

    return _Company2.default.findOneAndUpdate({ _id }, company, {
      new: true,
      useFindAndModify: true,
    });
  }
}

exports. default = new UpdateCompanyService();
