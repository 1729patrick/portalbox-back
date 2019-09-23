import Company from '../schemas/Company';

import Neighborhood from '../schemas/Neighborhood';
import City from '../schemas/City';
import File from '../schemas/File';

class UpdateCompanyService {
  async run({ _id, company }) {
    try {
      const neighborhood = await Neighborhood.count({
        _id: company.address.neighborhood,
      });

      if (!neighborhood) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Neighborhood not found');
    }

    try {
      const city = await City.count({ _id: company.address.city });

      if (!city) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('City not found');
    }

    try {
      const banner = await File.count({ _id: company.banner });

      if (!banner) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Banner not found');
    }

    try {
      const logo = await File.count({ _id: company.logo });

      if (!logo) {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Logo not found');
    }

    return Company.findOneAndUpdate({ _id }, company, {
      new: true,
      useFindAndModify: true,
    });
  }
}

export default new UpdateCompanyService();
