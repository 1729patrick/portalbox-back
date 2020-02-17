import Neighborhood from '../schemas/Neighborhood';
import City from '../schemas/City';

class UpdateCityService {
  async run({ _id, name = '', neighborhoods = [], companyId }) {
    const city = await City.findOne({ _id, company: companyId }).populate(
      'neighborhoods'
    );

    if (!city) {
      throw new Error('Cidade não encontrada 🧐');
    }

    const checkCityExist = await City.findOne({
      name,
      _id: { $ne: city._id },
      company: companyId,
    });

    if (checkCityExist) {
      throw new Error('Cidade já existe 🤨');
    }

    const cityName = name.replace(/ /g, '');

    if (!cityName.length) {
      throw new Error('O campo cidade precisa ser preenchido 🧐');
    }

    const neighborhoodsToCreate = neighborhoods.filter(({ name }) =>
      name.replace(/ /g, '')
    );

    if (!neighborhoodsToCreate.length) {
      throw new Error('Bairros não encontrados 🧐');
    }

    const neighborhoodsUnique = [
      ...new Set(neighborhoodsToCreate.map(({ name }) => name)),
    ];

    const createdNeighborhoods = await Promise.all(
      neighborhoodsUnique.map(name => {
        const { _id } = neighborhoods.find(
          neighborhood => neighborhood.name === name
        );

        const checkNeighborhoodExistById = city.neighborhoods.find(
          neighborhood => String(neighborhood._id) === _id
        );

        if (checkNeighborhoodExistById)
          return Neighborhood.findByIdAndUpdate(_id, { name });

        const checkNeighborhoodExistByName = city.neighborhoods.find(
          neighborhood => neighborhood.name === name
        );

        if (!checkNeighborhoodExistByName) return Neighborhood.create({ name });
      })
    );

    const validNeighborhoods = createdNeighborhoods.filter(value => value);
    return City.findOneAndUpdate(
      { _id, company: companyId },
      { name, neighborhoods: validNeighborhoods },
      { new: true }
    ).populate('neighborhoods');
  }
}

export default new UpdateCityService();
