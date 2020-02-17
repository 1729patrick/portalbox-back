import City from '../schemas/City';
import Neighborhood from '../schemas/Neighborhood';

class CreateCityService {
  async run({ name = '', neighborhoods = [], companyId }) {
    const checkCityExist = await City.findOne({
      name,
      company: companyId,
    });

    if (checkCityExist) {
      throw new Error('Cidade já existe 🤨');
    }

    const cityName = name.replace(/ /g, '');

    if (!cityName.length) {
      throw new Error('O campo cidade precisa ser preenchido 🧐');
    }

    const neighborhoodsToCreate = neighborhoods.filter(name =>
      name.replace(/ /g, '')
    );

    if (!neighborhoodsToCreate.length) {
      throw new Error('Bairros não encontrados 🧐');
    }

    const createdNeighborhoods = await Promise.all(
      [...new Set(neighborhoodsToCreate)].map(name =>
        Neighborhood.create({ name })
      )
    );

    return City.create({
      name,
      neighborhoods: createdNeighborhoods,
      company: companyId,
    });
  }
}

export default new CreateCityService();
