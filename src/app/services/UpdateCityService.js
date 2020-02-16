import Neighborhood from '../schemas/Neighborhood';
import City from '../schemas/City';

class UpdateCityService {
  async run({ _id, name, neighborhoods, companyId }) {
    const city = await City.findOne({ _id, company: companyId }).populate(
      'neighborhoods'
    );

    if (!city) {
      throw new Error('Cidade não encontrada 🧐');
    }

    const neighborhoodsUnique = [
      ...new Set(neighborhoods.map(({ name }) => name)),
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

    city.name = name;
    city.neighborhoods = validNeighborhoods;
    await city.save();

    neighborhoods = city.neighborhoods.map(({ _id, name }) => ({ _id, name }));

    return {
      _id: city._id,
      name,
      neighborhoods,
    };
  }
}

export default new UpdateCityService();
