import express from 'express';
import { addWord, 
    // deleteWordById, 
    // getWordByID, 
    getWords, updateWord } from './wordCont';

const router = express.Router();

router
    .get('/get-words', getWords)
    // .get('/get-word-by-id', getWordByID)
    .post('/add-word', addWord)
    .patch('/updateWord/:wordID', updateWord)
    // .delete('/deleteWordById/:wordID', deleteWordById);

export default router;