import express from 'express'
// import { getUserWords } from './userWordsCont';
import { deleteUserWord, getAllUsersWords, getXRandomUserWords } from './userWordsCont';

const router = express.Router();

router
.get('/getXRandomUserWords', getXRandomUserWords)
.get('/getAllUsersWords', getAllUsersWords)
.delete('/deleteUserWord/:wordID', deleteUserWord)

export default router;

//663fb0150a2ec72a48ca9a67