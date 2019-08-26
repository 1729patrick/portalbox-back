import File from '../schemas/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const { _id, url } = await File.create({ name, path });
    return res.json({ _id, url });
  }
}

export default new FileController();
