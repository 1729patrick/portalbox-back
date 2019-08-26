import City from '../schemas/City';

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
}

export default new CityController();
