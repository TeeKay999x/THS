import express from 'express'
import {loginAdmin, logout, newAdmin} from '../controllers/admin.controllers.js'

const router = express.Router()

router.post('/', newAdmin)
router.get('/', loginAdmin)
router.get('/logout', logout)


export default router