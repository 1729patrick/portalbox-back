import Neighborhood from '../schemas/Neighborhood';
import City from '../schemas/City';

class UpdateCityService {
  async run({ _id, name, neighborhoods }) {
    const city = await City.findByIdAndUpdate(_id, { name }).populate(
      'neighborhoods'
    );

    if (!city) {
      throw new Error('Cidade não encontrada 🧐');
    }

    const neighborhoodsUnique = [
      ...new Set(neighborhoods.map(({ name }) => name)),
    ];

    city.neighborhoods = (
      await Promise.all(
        neighborhoodsUnique.map(name => {
          const neighborhood = neighborhoods.find(
            neighborhood => neighborhood.name === name
          );

          if (
            city.neighborhoods.find(
              ({ _id }) => String(_id) === neighborhood._id
            )
          )
            return Neighborhood.findByIdAndUpdate(neighborhood._id, { name });

          if (!city.neighborhoods.find(n => n.name === name))
            return Neighborhood.create({ name });
        })
      )
    ).filter(value => value);

    await city.save();

    return {
      _id: city._id,
      name,
      neighborhoods: city.neighborhoods.map(({ _id, name }) => ({ _id, name })),
    };
  }
}

export default new UpdateCityService();
