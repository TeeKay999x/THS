import { protectRoute } from "../middlewarews/auth.middleware.js"
import { deleteProduct, getProduct, getProducts, newProduct, updateProduct } from "../controllers/product.controllers.js"
import express from 'express'

const router = express.Router()

router.post("/", protectRoute, newProduct)
router.get('/', protectRoute, getProducts)
router.get('/:id', protectRoute, getProduct)
router.put('/:id', protectRoute, updateProduct)
router.delete('/:id', protectRoute, deleteProduct)

export default router


