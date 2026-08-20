import { Router } from 'express';
import { getAllCategories, createCategory } from '../controllers/categoryController.js';
import { validateCategoryPayload } from '../middleware/validator.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', validateCategoryPayload, createCategory);

export default router;
