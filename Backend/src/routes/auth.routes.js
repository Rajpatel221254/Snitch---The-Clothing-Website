import express from 'express'
import { login, register } from '../controller/auth.controller.js';
import { validateRegisterUser , validateLoginUser} from '../middleware/auth.validator.js';

const router = express.Router();

router.post("/register", validateRegisterUser, register);
router.post("/login", validateLoginUser, login);

export default router;