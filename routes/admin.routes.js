import express from 'express'
import { loginAdmin, logout, newAdmin } from '../controllers/admin.controllers.js'

const router = express.Router()

router.post('/signup', newAdmin)
router.get('/login', loginAdmin)
router.get('/logout', logout)


export default router