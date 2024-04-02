import express from 'express'
// import { getUserWords } from './userWordsCont';
import { getUserWordsGili } from './userWordsCont';

const router = express.Router();

router.get('/get-user-words', getUserWordsGili)

export default router;