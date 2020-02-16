import City from '../schemas/City';
import Neighborhood from '../schemas/Neighborhood';

class CreateCityService {
  async run({ name, neighborhoods, companyId }) {
    const checkCityExist = await City.findOne({ name, company: companyId });

    if (checkCityExist) {
      throw new Error('Cidade já existe 🤨');
    }

    const city = await City.create({
      name,
      company: companyId,
    });

    city.neighborhoods = await Promise.all(
      [...new Set(neighborhoods)].map(name => Neighborhood.create({ name }))
    );

    await city.save();

    neighborhoods = city.neighborhoods.map(({ _id, name }) => ({ _id, name }));

    return {
      _id: city._id,
      name,
      neighborhoods,
    };
  }
}

export default new CreateCityService();
