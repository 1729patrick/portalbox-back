"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _File = require('../schemas/File'); var _File2 = _interopRequireDefault(_File);

class FileController {
  async store(req, res) {
    const manyFiles = req.files.map(({ originalname, filename }) => ({
      name: originalname,
      path: filename,
    }));

    let files = await _File2.default.insertMany(manyFiles);

    files = files.map(({ _id, url, name }) => ({
      _id,
      url,
      name,
    }));

    // const response = files.length === 1 ? files[0] : files;

    return res.json(files);
  }
}

exports. default = new FileController();
