import express from 'express';
import { addWord, deleteWordById, getWords, updateWord } from './wordCont';

const router = express.Router();

router
    .get('/get-words', getWords)
    .post('/add-word', addWord)
    .patch('/updateWord/:wordID', updateWord)
    .delete('/deleteWordById/:wordID', deleteWordById);

export default router;