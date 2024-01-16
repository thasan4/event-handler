import express from 'express';
import { postEvent } from '../controllers/eventController.js';

const router = express.Router();

router.post('/', postEvent);

export default router;
