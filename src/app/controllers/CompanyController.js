import CreateCompanyService from '../services/CreateCompanyService';
import UpdateCompanyService from '../services/UpdateCompanyService';

class CompanyController {
  async store(req, res) {
    const company = await CreateCompanyService.run({ company: req.body });

    return res.json(company);
  }

  async update(req, res) {
    // return res.json(req.body);
    const company = await UpdateCompanyService.run({
      _id: req.companyId,
      company: req.body,
    });

    return res.json(company);
  }
}

export default new CompanyController();
