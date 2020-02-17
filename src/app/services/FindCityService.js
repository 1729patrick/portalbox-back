import City from '../schemas/City';

class FindCityService {
  run({ companyId }) {
    return City.find({ company: companyId }, 'name').populate({
      path: 'neighborhoods',
      select: 'name',
    });
  }
}

export default new FindCityService();
