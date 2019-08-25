import File from '../schemas/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const { url, id } = await File.create({ name, path });
    return res.json({ url, id });
  }
}

export default new FileController();
