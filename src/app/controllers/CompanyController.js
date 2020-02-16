import CreateCompanyService from '../services/CreateCompanyService';
import UpdateCompanyService from '../services/UpdateCompanyService';

class CompanyController {
  async store(req, res) {
    const company = await CreateCompanyService.run({ company: req.body });

    return res.json(company);
  }

  async update(req, res) {
    const company = await UpdateCompanyService.run({
      companyId: req.companyId,
      company: req.body,
    });

    return res.json(company);
  }
}

export default new CompanyController();
