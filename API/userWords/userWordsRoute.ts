import express from 'express'
// import { getUserWords } from './userWordsCont';
import { deleteUserWord, exportUserWordsAsCSV, getAllUsersWords, getXRandomUserWords } from './userWordsCont';

const router = express.Router();

router
.get('/getXRandomUserWords', getXRandomUserWords)
.get('/getAllUsersWords', getAllUsersWords)
.get('/random-words', getXRandomUserWords)
.get("/export-user-words", exportUserWordsAsCSV)
.delete('/deleteUserWord/:wordID', deleteUserWord)

export default router;

