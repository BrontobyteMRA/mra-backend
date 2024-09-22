import { Router } from 'express';
import { getAccountDetails, getAllRoutes, getRoute, odataReadings, submitReadings, updateReadings } from '../controllers/meter.controller.js';
const router = Router();

router.get('/getAllRoutes', getAllRoutes);
router.get('/getRoute/:route', getRoute);
router.get('/getAccountDetails/:accNr', getAccountDetails);
router.post('/updateReadings', updateReadings);
router.post('/submitReadings', submitReadings);
router.get('/odata', odataReadings);

export default router;
