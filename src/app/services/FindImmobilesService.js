import Immobile from '../schemas/Immobile';

class FindImmobilesService {
  async run({ limit, countDocuments, ...restParams }) {
    let count = 0;
    if (countDocuments) {
      count = await this.findImmobile(restParams).countDocuments();
    }

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
  }

  findImmobile({
    _id,
    skip,
    limit,
    sessions,
    companyId,
    particularLenght,
    imagesLengh,
    finality,
    types,
    neighborhoods,
    priceMin = 0,
    priceMax = 999999999,
    particulars,
  }) {
    let idFind = {};
    if (_id) idFind = { _id };

    let sessionsFind = {};
    if (sessions)
      sessionsFind = { 'config.sessions': { $in: JSON.parse(sessions) } };

    let typeFind = {};
    if (types) typeFind = { type: { $in: JSON.parse(types) } };

    let neighborhoodFind = {};
    if (neighborhoods)
      neighborhoodFind = {
        'address.neighborhood': { $in: JSON.parse(neighborhoods) },
      };

    const priceRentFind = {
      'price.rent': { $gte: Number(priceMin), $lte: Number(priceMax) },
    };

    const priceSaleFind = {
      'price.sale': { $gte: Number(priceMin), $lte: Number(priceMax) },
    };

    let finalityFind = null;
    if (finality === 'rent') finalityFind = priceRentFind;
    else if (finality === 'sale') finalityFind = priceSaleFind;

    const noFinalityFind = { $or: [priceRentFind, priceSaleFind] };

    let particularsFind = {};
    if (particulars)
      particularsFind = {
        particulars: {
          $all: particulars.map(({ title, value }) => ({
            $elemMatch: {
              title,
              value: Number(value) ? { $gte: value } : value,
            },
          })),
        },
      };

    const find = Immobile.find(
      {
        company: companyId,
        ...sessionsFind,
        ...typeFind,
        ...neighborhoodFind,
        ...(finalityFind || noFinalityFind),
        ...particularsFind,
        ...idFind,
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
