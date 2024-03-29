import FindCityService from '../services/FindCityService';
import CreateCityService from '../services/CreateCityService';
import UpdateCityService from '../services/UpdateCityService';
class CityController {
  async index(req, res) {
    const cities = await FindCityService.run({ companyId: req.companyId });

    return res.json(cities);
  }

  async store(req, res) {
    const { name, neighborhoods } = req.body;

    const city = await CreateCityService.run({
      name,
      neighborhoods,
      companyId: req.companyId,
    });

    return res.json(city);
  }

  async update(req, res) {
    const { _id, name, neighborhoods } = req.body;

    const city = await UpdateCityService.run({
      _id,
      name,
      neighborhoods,
      companyId: req.companyId,
    });

    return res.json(city);
  }
}

export default new CityController();
