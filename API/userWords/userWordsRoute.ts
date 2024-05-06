import express from 'express'
// import { getUserWords } from './userWordsCont';
import { getAllUsersWords, getUserWordsGili } from './userWordsCont';

const router = express.Router();

router
.get('/get-user-words', getUserWordsGili)
.get('/getAllUsersWords', getAllUsersWords)

export default router;