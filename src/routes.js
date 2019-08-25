import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import CompanyController from './app/controllers/CompanyController';
import ImmobileController from './app/controllers/ImmobileController';
import FileController from './app/controllers/FileController';
import TypeController from './app/controllers/TypeController';
import CityController from './app/controllers/CityController';

import multerConfig from './config/multer';

const router = new Router();
const upload = multer(multerConfig);

router.post('/sessions', SessionController.store);
router.get('/sessions', SessionController.index);

router.use(authMiddleware);

router.post('/companies', CompanyController.store);

router.post('/immobiles', ImmobileController.store);
router.get('/immobiles', ImmobileController.index);

router.post('/types', TypeController.store);
router.get('/types', TypeController.index);

router.post('/cities', CityController.store);
router.get('/cities', CityController.index);

router.post('/files', upload.single('file'), FileController.store);

export default router;
