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
    limit,
    priceMin = 0,
    priceMax = 999999999,
  }) {
    try {
      const _idFind = _id ? { _id } : {};

      const sessionsFind = sessions
        ? { 'config.sessions': { $in: JSON.parse(sessions) } }
        : {};

      const typeFind = types ? { type: { $in: JSON.parse(types) } } : {};

      const neighborhoodFind = neighborhoods
        ? {
            'address.neighborhood': { $in: JSON.parse(neighborhoods) },
          }
        : {};

      const priceRentFind =
        priceMin >= 0 && priceMax >= 0
          ? { 'price.rent': { $gte: Number(priceMin), $lte: Number(priceMax) } }
          : {};

      const priceSaleFind =
        priceMin >= 0 && priceMax >= 0
          ? { 'price.sale': { $gte: Number(priceMin), $lte: Number(priceMax) } }
          : {};

      const finalityFind =
        finality === 'rent'
          ? priceRentFind
          : finality === 'sale'
          ? priceSaleFind
          : null;

      const noFinalityFind = { $or: [priceRentFind, priceSaleFind] };

      const findImmobile = (skip, limit) => {
        const find = Immobile.find(
          {
            company: companyId,
            ...sessionsFind,
            ...typeFind,
            ...neighborhoodFind,
            ...(finalityFind || noFinalityFind),
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
