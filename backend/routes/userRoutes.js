import express from 'express';
import { authUser,
  registerUser,
  logoutUser
   
} from '../controllers/userController.js';
import { shortenUrl,redirect } from '../controllers/urlController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router()

router.post('/shorten',protect,shortenUrl)
router.get('/:code',redirect)
router.post('/',registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)


export default router
