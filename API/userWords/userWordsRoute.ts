import express from 'express'
// import { getUserWords } from './userWordsCont';
import multer from "multer";
import { deleteAllUserWords, deleteUserWord, exportUserWordsAsCSV, getAllUsersWords, getXRandomUserWords, importUserWordsFromCSV } from './userWordsCont';

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp folder for uploaded files

router
.get('/getXRandomUserWords', getXRandomUserWords)
.get('/getAllUsersWords', getAllUsersWords)
.get('/random-words', getXRandomUserWords)
.get("/export-user-words", exportUserWordsAsCSV)
.delete('/deleteUserWord/:wordID', deleteUserWord)
.delete('/deleteAllUserWords', deleteAllUserWords)
.post("/importUserWordsFromCSV", upload.single("file"), importUserWordsFromCSV);

export default router;

