import Company from '../schemas/Company';

class CreateCompanyService {
  async run({ company }) {
    const checkUsernameExist = await Company.findOne({
      username: company.username,
    });

    if (checkUsernameExist) {
      throw new Error('Username alread exists');
    }

    const checkDomainExist = await Company.findOne({
      domains: { $in: company.domains },
    });

    if (checkDomainExist) {
      throw new Error('Domain alread exists');
    }
    
    const newCompany = await Company.create(company);

    return newCompany
      .populate('logo banner address.city address.neighborhood')
      .execPopulate();
  }
}

export default new CreateCompanyService();
