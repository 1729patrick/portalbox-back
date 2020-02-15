"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);
var _SessionController = require('./app/controllers/SessionController'); var _SessionController2 = _interopRequireDefault(_SessionController);
var _CompanyController = require('./app/controllers/CompanyController'); var _CompanyController2 = _interopRequireDefault(_CompanyController);
var _ImmobileController = require('./app/controllers/ImmobileController'); var _ImmobileController2 = _interopRequireDefault(_ImmobileController);
var _ImmobileDetailsController = require('./app/controllers/ImmobileDetailsController'); var _ImmobileDetailsController2 = _interopRequireDefault(_ImmobileDetailsController);
var _FileController = require('./app/controllers/FileController'); var _FileController2 = _interopRequireDefault(_FileController);
var _TypeController = require('./app/controllers/TypeController'); var _TypeController2 = _interopRequireDefault(_TypeController);
var _CityController = require('./app/controllers/CityController'); var _CityController2 = _interopRequireDefault(_CityController);

var _CityStore = require('./app/validators/CityStore'); var _CityStore2 = _interopRequireDefault(_CityStore);
var _CompanyStore = require('./app/validators/CompanyStore'); var _CompanyStore2 = _interopRequireDefault(_CompanyStore);
var _CompanyUpdate = require('./app/validators/CompanyUpdate'); var _CompanyUpdate2 = _interopRequireDefault(_CompanyUpdate);
var _ImmobileStore = require('./app/validators/ImmobileStore'); var _ImmobileStore2 = _interopRequireDefault(_ImmobileStore);
var _SessionStore = require('./app/validators/SessionStore'); var _SessionStore2 = _interopRequireDefault(_SessionStore);
var _TypeStore = require('./app/validators/TypeStore'); var _TypeStore2 = _interopRequireDefault(_TypeStore);

var _multer3 = require('./config/multer'); var _multer4 = _interopRequireDefault(_multer3);

const router = new (0, _express.Router)();
const upload = _multer2.default.call(void 0, _multer4.default);

router.post('/sessions', _SessionStore2.default, _SessionController2.default.store);
router.get('/sessions', _SessionController2.default.index);

router.use(_auth2.default);

router.post('/companies', _CompanyStore2.default, _CompanyController2.default.store);
router.put('/companies', _CompanyUpdate2.default, _CompanyController2.default.update);

router.post('/immobiles', _ImmobileStore2.default, _ImmobileController2.default.store);
router.get('/public/immobiles', _ImmobileController2.default.index);

router.get('/public/immobiles/:_id/details', _ImmobileDetailsController2.default.index);

router.post('/types', _TypeStore2.default, _TypeController2.default.store);
router.get('/public/types', _TypeController2.default.index);

router.post('/cities', _CityStore2.default, _CityController2.default.store);
router.get('/public/cities', _CityController2.default.index);

router.post('/files', upload.array('files'), _FileController2.default.store);

exports. default = router;
