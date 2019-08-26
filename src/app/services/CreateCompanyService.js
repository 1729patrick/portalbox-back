import Company from '../schemas/Company';
import File from '../schemas/File';

class FindCompanyService {
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

    try {
      await File.count({ _id: company.banner });
    } catch (err) {
      throw new Error('Banner not found');
    }

    try {
      await File.count({ _id: company.logo });
    } catch (err) {
      throw new Error('Logo not found');
    }

    const newCompany = await Company.create(company);

    return newCompany.populate('logo banner').execPopulate();
  }
}

export default new FindCompanyService();
