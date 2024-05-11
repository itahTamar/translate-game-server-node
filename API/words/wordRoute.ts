import express from 'express';
import { addWord, getWords, updateWord } from './wordCont';

const router = express.Router();

router
    .get('/get-words', getWords)
    .post('/add-word', addWord)
    .post('/updateWord/:wordID', updateWord)
    // .delete('/delete-word', deleteWord);

export default router;