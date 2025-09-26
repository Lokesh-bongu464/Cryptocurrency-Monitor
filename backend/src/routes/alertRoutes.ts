import { Router } from 'express';
import {
  createAlert,
  getAlerts,
  deleteAlert,
} from '../controllers/alertController';

const router = Router();

router.post('/alerts', createAlert);
router.get('/alerts', getAlerts);
router.delete('/alerts/:id', deleteAlert);

export default router;