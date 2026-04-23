import express from "express";
import { authenticateSeller, authenticateUser } from "../middleware/auth.middleware.js";
import { createProduct, getAllProduct,deleteProduct, editProduct, getProduct, getSellerProducts } from "../controller/product.controller.js";
import multer from "multer";
import { validateCreateProduct } from "../validators/product.validator.js";

const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

const router = express.Router();


/**
* @route POST /api/products
* @desc Create a new product
* @access Private (Seller only)
*/
router.post("/", authenticateSeller, upload.array("images", 7),validateCreateProduct, createProduct);

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public 
 */
router.get('/', getAllProduct)

/**
* @route GET /api/products/seller
* @desc Get all seller products
* @access Private (Seller only)
*/
router.get('/seller', authenticateSeller, getSellerProducts);

/**
* @route DELETE /api/products/delete/:id
* @desc Delete a product
* @access Private (Seller only)
*/
router.delete('/delete/:id',authenticateSeller, deleteProduct)

/**
 * @route PUT /api/products/edit/:id
 * @desc Edit a product
 * @access Private (Seller only)
 */
router.put('/edit/:id', upload.array('images',7),authenticateSeller , editProduct)

/**
 * @route GET /api/products/get/:id
 * @desc Get product by ID
 * @access Private (Seller only)
 */
router.get('/get/:id', getProduct)

export default router;
