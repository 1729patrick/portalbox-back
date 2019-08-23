import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import CompanyController from './app/controllers/CompanyController';

import authMiddleware from './app/middlewares/auth';

const router = new Router();

router.post('/sessions', SessionController.store);

router.use(authMiddleware);
router.post('/companies', CompanyController.store);
router.get('/companies', CompanyController.index);

export default router;
