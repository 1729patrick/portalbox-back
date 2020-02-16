import File from '../schemas/File';

class CreateFileService {
  async run({ files }) {
    const manyFiles = files.map(({ originalname, filename }) => ({
      name: originalname,
      path: filename,
    }));

    const createdFiles = await File.insertMany(manyFiles);

    return createdFiles.map(({ _id, url, name }) => ({
      _id,
      url,
      name,
    }));
  }
}

export default new CreateFileService();
