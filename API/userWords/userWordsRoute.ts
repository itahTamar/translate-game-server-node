import express from 'express'
// import { getUserWords } from './userWordsCont';
import { getAllUsersWords, getXRandomUserWords } from './userWordsCont';

const router = express.Router();

router
.get('/getXRandomUserWords', getXRandomUserWords)
.get('/getAllUsersWords', getAllUsersWords)

export default router;