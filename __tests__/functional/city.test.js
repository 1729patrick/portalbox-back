import mongoose from 'mongoose';
import Company from '../../src/app/schemas/Company';

import City from '../../src/app/schemas/City';
import Neighborhood from '../../src/app/schemas/Neighborhood';

import CreateCityService from '../../src/app/services/CreateCityService';
import FindCityService from '../../src/app/services/FindCityService';
import UpdateCityService from '../../src/app/services/UpdateCityService';

describe('city', () => {
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

    const createdNeighborhoodsName = createdCity.neighborhoods.map(
      ({ name }) => name
    );

    expect({
      name: createdCity.name,
      neighborhoods: createdNeighborhoodsName,
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

    const createdNeighborhoodsName = createdCity.neighborhoods.map(
      ({ name }) => name
    );

    const cityNeighborhoodUnique = [
      'Bairro Alto',
      'Bairro Médio',
      'Bairro Baixo',
    ];

    expect({
      name: createdCity.name,
      neighborhoods: createdNeighborhoodsName,
    }).toEqual({ name: city.name, neighborhoods: cityNeighborhoodUnique });

    const findedCity = await City.findOne(createdCity).populate(
      'neighborhoods'
    );

    expect(createdCity.toJSON()).toEqual(findedCity.toJSON());
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
    await City.create({
      company: companyId,
      name: 'Lisboa',
      neighborhoods: [neighborhood],
    });

    const createdCity = async () =>
      CreateCityService.run({
        companyId,
        name: 'Lisboa',
        neighborhoods: ['Bairro Alto'],
      });

    await expect(createdCity()).rejects.toThrow('Cidade já existe 🤨');
  });

  it('should throws error on insert a city without name', async () => {
    const city = {
      name: '',
      neighborhoods: ['Bairro Alto'],
    };

    const createdCity = async () =>
      CreateCityService.run({
        companyId,
        ...city,
      });

    await expect(createdCity()).rejects.toThrow(
      'O campo cidade precisa ser preenchido 🧐'
    );
  });

  it('should throws error on insert a city and neighborhood without name', async () => {
    const city = {
      name: 'Lisboa',
      neighborhoods: [''],
    };

    const createdCity = async () =>
      CreateCityService.run({
        companyId,
        ...city,
      });

    await expect(createdCity()).rejects.toThrow('Bairros não encontrados 🧐');
  });

  it('should insert a city and ignore neighborhood without name', async () => {
    const city = {
      name: 'Lisboa',
      neighborhoods: ['Bairro Alto', '', ''],
    };

    const createdCity = await CreateCityService.run({
      companyId,
      ...city,
    });

    const createdNeighborhoodsName = createdCity.neighborhoods.map(
      ({ name }) => name
    );

    const cityNeighborhoodsValid = ['Bairro Alto'];

    expect({
      name: createdCity.name,
      neighborhoods: createdNeighborhoodsName,
    }).toEqual({ name: city.name, neighborhoods: cityNeighborhoodsValid });

    const findedCity = await City.findOne(createdCity).populate(
      'neighborhoods'
    );

    expect(createdCity.toJSON()).toEqual(findedCity.toJSON());
  });

  it('should find all cities for company', async () => {
    const formatCity = ({ _id, name, neighborhoods }) => ({
      _id,
      name,
      neighborhoods: neighborhoods.map(({ _id, name }) => ({ _id, name })),
    });

    const neighborhood1 = await Neighborhood.create({ name: 'Bairro Baixo' });
    const neighborhood2 = await Neighborhood.create({ name: 'Bairro Médio' });
    const neighborhood3 = await Neighborhood.create({ name: 'Bairro Alto' });
    const neighborhood4 = await Neighborhood.create({ name: 'Bairro Ultra' });
    const neighborhood5 = await Neighborhood.create({ name: 'Bairro Céu' });
    const neighborhood6 = await Neighborhood.create({ name: 'Bairro Espaço' });

    const city1 = await City.create({
      name: 'Lisboa',
      neighborhoods: [neighborhood1, neighborhood2, neighborhood3],
      company: companyId,
    });
    const city2 = await City.create({
      name: 'Berlim',
      neighborhoods: [neighborhood4, neighborhood5],
      company: companyId,
    });
    const city3 = await City.create({
      name: 'Viena',
      neighborhoods: [neighborhood6],
      company: companyId,
    });

    const cities = await FindCityService.run({ companyId }).lean();

    expect(cities).toEqual([
      formatCity(city1),
      formatCity(city2),
      formatCity(city3),
    ]);
  });

  it('should update a city and neighborhoods', async () => {
    const neighborhood1 = await Neighborhood.create({ name: 'Bairro Baixo' });
    const neighborhood2 = await Neighborhood.create({ name: 'Bairro Médio' });
    const neighborhood3 = await Neighborhood.create({ name: 'Bairro Alto' });

    const createdCity = await City.create({
      name: 'Lisboa',
      neighborhoods: [neighborhood1, neighborhood2, neighborhood3],
      company: companyId,
    });

    await UpdateCityService.run({
      companyId,
      _id: createdCity._id,
      name: 'Luxemburgo',
      neighborhoods: [{ name: 'Centro' }, { name: 'Seixal' }],
    });

    const findedCity = await City.findById(createdCity._id).populate(
      'neighborhoods'
    );

    const city = {
      name: findedCity.name,
      neighborhoods: findedCity.neighborhoods.map(({ name }) => ({ name })),
    };

    expect(city).toEqual({
      name: 'Luxemburgo',
      neighborhoods: [{ name: 'Centro' }, { name: 'Seixal' }],
    });
  });

  it('should update a city and ignore duplicates neighborhoods', async () => {
    const neighborhood1 = await Neighborhood.create({ name: 'Bairro Baixo' });
    const neighborhood2 = await Neighborhood.create({ name: 'Bairro Médio' });
    const neighborhood3 = await Neighborhood.create({ name: 'Bairro Alto' });

    const createdCity = await City.create({
      name: 'Lisboa',
      neighborhoods: [neighborhood1, neighborhood2, neighborhood3],
      company: companyId,
    });

    await UpdateCityService.run({
      companyId,
      _id: createdCity._id,
      name: 'Luxemburgo',
      neighborhoods: [
        { name: 'Centro' },
        { name: 'Centro' },
        { name: 'Seixal' },
        { name: 'Seixal Carpa' },
      ],
    });

    const findedCity = await City.findById(createdCity._id).populate(
      'neighborhoods'
    );

    const city = {
      name: findedCity.name,
      neighborhoods: findedCity.neighborhoods.map(({ name }) => ({ name })),
    };

    expect(city).toEqual({
      name: 'Luxemburgo',
      neighborhoods: [
        { name: 'Centro' },
        { name: 'Seixal' },
        { name: 'Seixal Carpa' },
      ],
    });
  });

  it('should throws error on update a city without name', async () => {
    const neighborhood = await Neighborhood.create({ name: 'Bairro Baixo' });

    const createdCity = await City.create({
      name: 'Lisboa',
      neighborhoods: [neighborhood],
      company: companyId,
    });

    const updatedCity = () =>
      UpdateCityService.run({
        companyId,
        _id: createdCity._id,
        name: '',
        neighborhoods: [{ name: 'Bairro Baixo' }],
      });

    await expect(updatedCity()).rejects.toThrow(
      'O campo cidade precisa ser preenchido 🧐'
    );
  });

  it('should throws error on update a city without neighborhoods', async () => {
    const neighborhood = await Neighborhood.create({ name: 'Bairro Baixo' });

    const createdCity = await City.create({
      name: 'Lisboa',
      neighborhoods: [neighborhood],
      company: companyId,
    });

    const updatedCity = () =>
      UpdateCityService.run({
        companyId,
        _id: createdCity._id,
        name: 'Lisboa',
        neighborhoods: [],
      });

    await expect(updatedCity()).rejects.toThrow('Bairros não encontrados 🧐');
  });

  it('should throws error on update a city with duplicated name', async () => {
    const neighborhood1 = await Neighborhood.create({ name: 'Bairro Baixo' });
    const neighborhood2 = await Neighborhood.create({
      name: 'Bairro de Dentro',
    });

    const createdCity = await City.create({
      name: 'Roma',
      neighborhoods: [neighborhood1],
      company: companyId,
    });

    await City.create({
      name: 'Lisboa',
      neighborhoods: [neighborhood2],
      company: companyId,
    });

    const updatedCity = () =>
      UpdateCityService.run({
        companyId,
        _id: createdCity._id,
        name: 'Lisboa',
        neighborhoods: [{ name: 'Bairro Alto' }],
      });

    await expect(updatedCity()).rejects.toThrow('Cidade já existe 🤨');
  });

  it('should throws error on update a neighborhood without name', async () => {
    const neighborhood = await Neighborhood.create({ name: 'Bairro Baixo' });

    const createdCity = await City.create({
      name: 'Lisboa',
      neighborhoods: [neighborhood],
      company: companyId,
    });

    const updatedCity = () =>
      UpdateCityService.run({
        companyId,
        _id: createdCity._id,
        name: 'Marselha',
        neighborhoods: [{ name: '' }],
      });

    await expect(updatedCity()).rejects.toThrow('Bairros não encontrados 🧐');
  });

  it('should update a city and ignore neighborhood without name', async () => {
    const neighborhood = await Neighborhood.create({ name: 'Bairro Baixo' });

    const createdCity = await City.create({
      name: 'Lisboa',
      neighborhoods: [neighborhood],
      company: companyId,
    });

    const updatedCity = await UpdateCityService.run({
      companyId,
      _id: createdCity._id,
      name: 'Marselha',
      neighborhoods: [
        { name: 'Porto' },
        { name: 'Porto Leste' },
        { name: '' },
        { name: '' },
      ],
    });

    const updatedNeighborhoodsName = updatedCity.neighborhoods.map(
      ({ name }) => ({ name })
    );

    expect(updatedNeighborhoodsName).toEqual([
      { name: 'Porto' },
      { name: 'Porto Leste' },
    ]);
  });
});
