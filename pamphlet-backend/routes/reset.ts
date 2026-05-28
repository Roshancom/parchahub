import express from 'express';
import {
  passwordHandler,
  resetHandler,
} from '../controllers/passwordController.js';

const router = express.Router();

router.post('/', resetHandler);
router.post('/confirm', passwordHandler);

export default router;
