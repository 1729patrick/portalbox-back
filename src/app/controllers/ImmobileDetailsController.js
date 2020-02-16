import FindImmobilesService from '../services/FindImmobilesService';

class ImmobileDetailsController {
  async index(req, res) {
    const { immobiles } = await FindImmobilesService.run({
      _id: req.params._id,
      companyId: req.companyId,
      countDocuments: false,
    });

    return res.json(...immobiles);
  }
}

export default new ImmobileDetailsController();
