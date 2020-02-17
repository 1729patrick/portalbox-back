import mongoose from 'mongoose';
import Company from '../../src/app/schemas/Company';

import City from '../../src/app/schemas/City';
import Neighborhood from '../../src/app/schemas/Neighborhood';

import CreateCityService from '../../src/app/services/CreateCityService';

describe('insert', () => {
  let companyId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    const company = {
      name: 'company',
      description: 'the best company',
      username: 'pb',
      password: 'pb',
      address: {
        cep: '89905-000',
        street: 'Rua primeiro de maio',
      },
      domains: ['localhost'],
    };

    const { _id } = await Company.create(company);
    companyId = _id;
  });

  afterAll(async () => {
    await Company.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await City.deleteMany({});
    await Neighborhood.deleteMany({});
  });

  it('should insert a city and neighborhood', async () => {
    const city = {
      name: 'Lisboa',
      neighborhoods: ['Bairro Alto', 'Bairro Médio', 'Bairro Baixo'],
    };

    const createdCity = await CreateCityService.run({
      companyId,
      ...city,
    });

    const createdNeighborhoodName = createdCity.neighborhoods.map(
      ({ name }) => name
    );

    expect({
      name: createdCity.name,
      neighborhoods: createdNeighborhoodName,
    }).toEqual(city);

    const findedCity = await City.findOne(createdCity).populate(
      'neighborhoods'
    );

    expect(createdCity.toJSON()).toEqual(findedCity.toJSON());
  });

  it('should insert a city and no insert duplicates neighborhood', async () => {
    const city = {
      name: 'Lisboa',
      neighborhoods: [
        'Bairro Alto',
        'Bairro Médio',
        'Bairro Baixo',
        'Bairro Alto',
        'Bairro Médio',
        'Bairro Baixo',
      ],
    };

    const createdCity = await CreateCityService.run({
      companyId,
      ...city,
    });

    const createdNeighborhoodName = createdCity.neighborhoods.map(
      ({ name }) => name
    );

    const cityNeighborhoodUnique = [...new Set(city.neighborhoods)];

    expect({
      name: createdCity.name,
      neighborhoods: createdNeighborhoodName,
    }).toEqual({ name: city.name, neighborhoods: cityNeighborhoodUnique });

    const findedCity = await City.findOne(createdCity).populate(
      'neighborhoods'
    );

    expect(createdCity.neighborhoods.length).toEqual(
      findedCity.neighborhoods.length
    );
  });

  it('should throws error on insert a city without neighborhood', async () => {
    const city = {
      name: 'Lisboa',
      neighborhoods: [],
    };

    const createdCity = async () =>
      CreateCityService.run({
        companyId,
        ...city,
      });

    await expect(createdCity()).rejects.toThrow('Bairros não encontrados 🧐');
  });

  it('should throws error on insert a duplicated city', async () => {
    const neighborhood = await Neighborhood.create({ name: 'Bairro Alto' });

    const city = {
      name: 'Lisboa',
      neighborhoods: [neighborhood],
    };

    await City.create({ company: companyId, ...city });

    const createdCity = async () =>
      CreateCityService.run({
        companyId,
        ...city,
      });

    await expect(createdCity()).rejects.toThrow('Cidade já existe 🤨');
  });
});
