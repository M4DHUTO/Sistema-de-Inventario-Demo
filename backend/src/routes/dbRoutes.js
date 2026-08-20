import { Router } from 'express';
import { getHealth, resetDatabase, executeReadOnlyQuery } from '../controllers/dbController.js';

const router = Router();

router.get('/health', getHealth);
router.post('/reset', resetDatabase);
router.post('/seed', resetDatabase);
router.post('/query', executeReadOnlyQuery);

export default router;
