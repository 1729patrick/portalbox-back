import Company from '../schemas/Company';

import Neighborhood from '../schemas/Neighborhood';
import City from '../schemas/City';
import File from '../schemas/File';

class UpdateCompanyService {
  async run({ _id, company }) {
    const companyToCheck = await Company.findById({ _id }).select('+password');

    if (!companyToCheck.checkPassword(company.password)) {
      throw new Error('Senha inválida 😱', 300);
    }

    try {
      const neighborhood = await Neighborhood.countDocuments(
        company.address.neighborhood
      );

      if (!neighborhood) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Bairro não encontrado 🧐');
    }

    try {
      const city = await City.countDocuments(company.address.city);

      if (!city) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Cidade não encontrada 🧐');
    }

    try {
      const { _id } = company.banner;
      const banner = await File.countDocuments({ _id });

      if (!banner) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Banner não encontrado 🧐');
    }

    try {
      const { _id } = company.logo;
      const logo = await File.countDocuments({ _id });

      if (!logo) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Logo não encontrada 🧐');
    }

    return Company.findOneAndUpdate({ _id }, company, {
      new: true,
      useFindAndModify: true,
    });
  }
}

export default new UpdateCompanyService();
