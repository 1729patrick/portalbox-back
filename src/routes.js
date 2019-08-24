import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import CompanyController from './app/controllers/CompanyController';
import ImmobileController from './app/controllers/ImmobileController';

import authMiddleware from './app/middlewares/auth';

const router = new Router();

router.post('/sessions', SessionController.store);
router.get('/sessions', SessionController.index);

router.use(authMiddleware);
router.post('/companies', CompanyController.store);
router.get('/companies', CompanyController.index);
router.post('/immobiles', ImmobileController.store);
router.get('/immobiles', ImmobileController.index);

export default router;
