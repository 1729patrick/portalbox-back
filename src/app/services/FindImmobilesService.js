import Immobile from '../schemas/Immobile';

class FindImmobilesService {
  async run({ sessions, companyId, _id }) {
    try {
      const sessionsFind = sessions
        ? { 'config.sessions': { $in: JSON.parse(sessions) } }
        : {};

      const _idFind = _id ? { _id } : {};

      const findImmobile = () =>
        Immobile.find(
          {
            company: companyId,
            ...sessionsFind,
            ..._idFind,
          },
          [
            'address',
            'map',
            'price',
            'images',
            'type',
            'particulars',
            'config.sessions',
          ]
        );

      const count = await findImmobile().count();

      let skip = Math.random() * count;
      skip = skip >= 8 ? skip - 8 : 0;

      const immobiles = await findImmobile()
        .populate([
          { path: 'address.city', model: 'City', select: 'name' },
          {
            path: 'address.neighborhood',
            model: 'Neighborhood',
            select: 'name',
          },
          { path: 'type', model: 'Type', select: 'name' },
          { path: 'images.file', model: 'File', select: 'url path' },
        ])
        .skip(skip)
        .limit(8);

      return { immobiles, count };
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new FindImmobilesService();
