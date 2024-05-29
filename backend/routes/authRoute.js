import express from 'express';
import { loginFunction } from '../controllers/authCtrl.js';

const router = express.Router();

router.post('/login', loginFunction);

export default router;
