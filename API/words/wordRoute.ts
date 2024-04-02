import express from 'express'
import { addWord, getWords} from './wordCont';

const router = express.Router();

router
    .get('/get-words', getWords)
    .post('/add-word', addWord)
    // .delete('/delete-word', deleteWord);

export default router;