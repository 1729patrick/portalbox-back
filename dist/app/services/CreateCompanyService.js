"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Company = require('../schemas/Company'); var _Company2 = _interopRequireDefault(_Company);

class CreateCompanyService {
  async run({ company }) {
    const checkUsernameExist = await _Company2.default.findOne({
      username: company.username,
    });

    if (checkUsernameExist) {
      throw new Error('Username alread exists');
    }

    const checkDomainExist = await _Company2.default.findOne({
      domains: { $in: company.domains },
    });

    if (checkDomainExist) {
      throw new Error('Domain alread exists');
    }
    
    const newCompany = await _Company2.default.create(company);

    return newCompany
      .populate('logo banner address.city address.neighborhood')
      .execPopulate();
  }
}

exports. default = new CreateCompanyService();
