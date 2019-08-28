import File from '../schemas/File';

class FileController {
  async store(req, res) {
    const manyFiles = req.files.map(({ originalname, filename }) => ({
      name: originalname,
      path: filename,
    }));

    let files = await File.insertMany(manyFiles);

    files = files.map(({ _id, url, name }) => ({
      _id,
      url,
      name,
    }));

    // const response = files.length === 1 ? files[0] : files;

    return res.json(files);
  }
}

export default new FileController();
