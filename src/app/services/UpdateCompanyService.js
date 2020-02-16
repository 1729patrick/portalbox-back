import Company from '../schemas/Company';

import Neighborhood from '../schemas/Neighborhood';
import City from '../schemas/City';
import File from '../schemas/File';

class UpdateCompanyService {
  async run({ companyId, company }) {
    const companyToCheck = await Company.findById(companyId).select(
      '+password'
    );

    if (!companyToCheck) {
      throw new Error('Empresa não encontrada 🧐');
    }

    if (!companyToCheck.checkPassword(company.password)) {
      throw new Error('Senha inválida 😱');
    }

    const checkNeighborhoodExist = await Neighborhood.countDocuments(
      company.address.neighborhood
    );

    if (!checkNeighborhoodExist) {
      throw new Error('Bairro não encontrado 🧐');
    }

    const checkCityExist = await City.countDocuments(company.address.city);

    if (!checkCityExist) {
      throw new Error('Cidade não encontrada 🧐');
    }

    const checkBannerExist = await File.countDocuments({
      _id: company.banner._id,
    });

    if (!checkBannerExist) {
      throw new Error('Banner não encontrado 🧐');
    }

    const checkLogoExist = await File.countDocuments({ _id: company.logo._id });

    if (!checkLogoExist) {
      throw new Error('Logo não encontrada 🧐');
    }

    return Company.findOneAndUpdate({ _id: companyId }, company, {
      new: true,
      useFindAndModify: true,
    });
  }
}

export default new UpdateCompanyService();
