"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _CreateCompanyService = require('../services/CreateCompanyService'); var _CreateCompanyService2 = _interopRequireDefault(_CreateCompanyService);
var _UpdateCompanyService = require('../services/UpdateCompanyService'); var _UpdateCompanyService2 = _interopRequireDefault(_UpdateCompanyService);

class CompanyController {
  async store(req, res) {
    const company = await _CreateCompanyService2.default.run({ company: req.body });

    return res.json(company);
  }

  async update(req, res) {
    const company = await _UpdateCompanyService2.default.run({
      _id: req.companyId,
      company: req.body,
    });

    return res.json(company);
  }
}

exports. default = new CompanyController();
