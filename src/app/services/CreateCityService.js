import City from '../schemas/City';
import Neighborhood from '../schemas/Neighborhood';

class CreateCityService {
  async run({ name, neighborhoods, companyId }) {
    const checkCityExist = await City.findOne({
      name,
      company: companyId,
    });

    if (checkCityExist) {
      throw new Error('Cidade já existe 🤨');
    }

    if (!neighborhoods.length) {
      throw new Error('Bairros não encontrados 🧐');
    }

    neighborhoods = await Promise.all(
      [...new Set(neighborhoods)].map(name => Neighborhood.create({ name }))
    );

    const city = await City.create({
      name,
      neighborhoods,
      company: companyId,
    });

    return city;
  }
}

export default new CreateCityService();
