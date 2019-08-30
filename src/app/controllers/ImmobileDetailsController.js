import FindImmobilesService from '../services/FindImmobilesService';

class ImmobileDetailsController {
  async index(req, res) {
    const { _id } = req.params;

    const { immobiles } = await FindImmobilesService.run({
      _id,
      companyId: req.companyId,
    });

    if (immobiles.length !== 1) {
      return res.status(404).json({ error: 'Immobile not found' });
    }

    return res.json(...immobiles);
  }
}

export default new ImmobileDetailsController();
