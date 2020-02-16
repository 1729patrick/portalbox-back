import City from '../schemas/City';
import Neighborhood from '../schemas/Neighborhood';

import CreateCityService from '../services/CreateCityService';
class CityController {
  async store(req, res) {
    const { name, neighborhoods } = req.body;

    const city = await CreateCityService.run({
      name,
      neighborhoods,
      companyId: req.companyId,
    });

    return res.json(city);
  }

  async index(req, res) {
    const cities = await City.find({ company: req.companyId }, 'name').populate(
      {
        path: 'neighborhoods',
        select: 'name',
      }
    );

    return res.json(cities);
  }

  async update(req, res) {
    const { _id, name, neighborhoods } = req.body;
    const city = await City.findByIdAndUpdate(_id, { name }).populate(
      'neighborhoods'
    );

    if (!city) {
      return res.status(401).json({ error: 'Cidade não encontrada 🧐' });
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

    return res.json({
      _id: city._id,
      name,
      neighborhoods: city.neighborhoods.map(({ _id, name }) => ({ _id, name })),
    });
  }
}

export default new CityController();
