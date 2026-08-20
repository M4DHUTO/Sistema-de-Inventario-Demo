import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { validateProductPayload } from '../middleware/validator.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', validateProductPayload, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
