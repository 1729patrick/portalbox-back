import Immobile from '../schemas/Immobile';

class FindImmobilesService {
  async run({
    sessions,
    companyId,
    _id,
    particularLenght,
    imagesLengh,
    finality,
    types,
    neighborhoods,
  }) {
    try {
      const _idFind = _id ? { _id } : {};

      const sessionsFind = sessions
        ? { 'config.sessions': { $in: JSON.parse(sessions) } }
        : {};

      const finalityFind =
        finality === 'rent'
          ? { 'price.rent': { $ne: null } }
          : finality === 'sale'
          ? { 'price.sale': { $ne: null } }
          : '';

      const typeFind = types ? { type: { $in: JSON.parse(types) } } : {};
      const neighborhoodFind = neighborhoods
        ? {
            'address.neighborhood': { $in: JSON.parse(neighborhoods) },
          }
        : {};

      const findImmobile = (skip, limit) => {
        const find = Immobile.find(
          {
            company: companyId,
            ...sessionsFind,
            ...finalityFind,
            ...typeFind,
            ...neighborhoodFind,
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
            'rates',
          ]
        );

        if (particularLenght) find.slice('particulars', particularLenght);

        if (imagesLengh) find.slice('images', imagesLengh);

        if (limit) find.skip(skip).limit(limit);

        return find;
      };

      const count = await findImmobile().count();

      let skip = Math.random() * count;
      const limit = 8;

      skip = count - skip >= limit ? skip : 0;

      const immobiles = await findImmobile(skip, limit).populate([
        { path: 'address.city', model: 'City', select: 'name' },
        {
          path: 'address.neighborhood',
          model: 'Neighborhood',
          select: 'name',
        },
        { path: 'type', model: 'Type', select: 'name' },
        { path: 'images.file', model: 'File', select: 'url path' },
      ]);

      return { immobiles, count };
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new FindImmobilesService();
