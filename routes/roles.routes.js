import { Router } from 'express';
import { adminPage, userPage, vendorPage } from '../controllers/role.controller.js';
import { checkRole } from '../middleware/role.middleware.js';
const router = Router();

router.get('/admin', checkRole('Admin'), adminPage);
router.get('/vendor', checkRole('Vendor'), vendorPage);
router.get('/user', checkRole('User'), userPage);

export default router;
