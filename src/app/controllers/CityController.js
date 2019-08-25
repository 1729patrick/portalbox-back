import City from '../schemas/City';
import Neighborhood from '../schemas/Neighborhood';

class CityController {
  async store(req, res) {
    let { name, neighborhoods } = req.body;

    const city = await City.create({
      name,
      company: req.companyId,
    });

    city.neighborhoods = await Promise.all(
      neighborhoods.map(name => Neighborhood.create({ name }))
    );

    await city.save();

    neighborhoods = city.neighborhoods.map(({ _id, name }) => ({ _id, name }));

    return res.json({ name, neighborhoods });
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
}

export default new CityController();
