import CreateFileService from '../services/CreateFileService';

class FileController {
  async store(req, res) {
    const files = await CreateFileService.run({ files: req.files });

    return res.json(files);
  }
}

export default new FileController();
