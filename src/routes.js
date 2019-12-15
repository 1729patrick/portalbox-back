import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import CompanyController from './app/controllers/CompanyController';
import ImmobileController from './app/controllers/ImmobileController';
import ImmobileDetailsController from './app/controllers/ImmobileDetailsController';
import FileController from './app/controllers/FileController';
import TypeController from './app/controllers/TypeController';
import CityController from './app/controllers/CityController';

import validateCityStore from './app/validators/CityStore';
import validateCompanyStore from './app/validators/CompanyStore';
import validateCompanyUpdate from './app/validators/CompanyUpdate';
import validateImmobileStore from './app/validators/ImmobileStore';
import validateSessionStore from './app/validators/SessionStore';
import validateTypeStore from './app/validators/TypeStore';

import multerConfig from './config/multer';

const router = new Router();
const upload = multer(multerConfig);

router.post('/sessions', validateSessionStore, SessionController.store);
router.get('/sessions', SessionController.index);

router.use(authMiddleware);

router.post('/companies', validateCompanyStore, CompanyController.store);
router.put('/companies', validateCompanyUpdate, CompanyController.update);

router.post('/immobiles', validateImmobileStore, ImmobileController.store);
router.get('/public/immobiles', ImmobileController.index);

router.get('/public/immobiles/:_id/details', ImmobileDetailsController.index);

router.post('/types', validateTypeStore, TypeController.store);
router.get('/public/types', TypeController.index);

router.post('/cities', validateCityStore, CityController.store);
router.get('/public/cities', CityController.index);

router.post('/files', upload.array('files'), FileController.store);

export default router;
