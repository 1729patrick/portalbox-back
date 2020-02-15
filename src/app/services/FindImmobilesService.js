import Immobile from '../schemas/Immobile';

class FindImmobilesService {
  async run({ limit, ...restParams }) {
    try {
      const count = await this.findImmobile(restParams).countDocuments();

      let skip = Math.random() * count;

      skip = count - skip >= limit ? skip : 0;

      const immobiles = await this.findImmobile({
        skip,
        limit,
        ...restParams,
      }).populate([
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

  findImmobile({
    skip,
    limit,
    sessions,
    companyId,
    _id,
    particularLenght,
    imagesLengh,
    finality,
    types,
    neighborhoods,
    priceMin = 0,
    priceMax = 999999999,
    particulars,
  }) {
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

    const priceRentFind = {
      'price.rent': { $gte: Number(priceMin), $lte: Number(priceMax) },
    };

    const priceSaleFind = {
      'price.sale': { $gte: Number(priceMin), $lte: Number(priceMax) },
    };

    const finalityFind =
      finality === 'rent'
        ? priceRentFind
        : finality === 'sale'
        ? priceSaleFind
        : null;

    const noFinalityFind = { $or: [priceRentFind, priceSaleFind] };

    const particularsFind = particulars
      ? {
          particulars: {
            $all: particulars.map(({ title, value }) => ({
              $elemMatch: {
                title,
                value: Number(value) ? { $gte: value } : value,
              },
            })),
          },
        }
      : {};

    const find = Immobile.find(
      {
        company: companyId,
        ...sessionsFind,
        ...typeFind,
        ...neighborhoodFind,
        ...(finalityFind || noFinalityFind),
        ...particularsFind,
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
  }
}

export default new FindImmobilesService();
