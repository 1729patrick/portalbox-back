import CreateCompanyService from '../services/CreateCompanyService';

class CompanyController {
  async store(req, res) {
    const company = await CreateCompanyService.run({ company: req.body });

    return res.json(company);
  }
}

export default new CompanyController();
