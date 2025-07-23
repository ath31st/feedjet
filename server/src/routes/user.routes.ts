import { Router } from 'express';
//import { isAuthenticated } from '../middleware/auth.middleware';
import { API_PREFIX } from '../utils/constants/routes.constants.js';
import { userController } from '../container.js';

const router = Router();

router.post('/users', userController.create);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById);

const userRoutes = Router();
userRoutes.use(API_PREFIX, router);

export default userRoutes;
