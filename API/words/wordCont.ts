//import { UserWordsModel } from './wordModel';
//import { userWordsArr } from './../userWords/userWordsModel';
// import { UserModel, UserSchema } from './../users/userModel';
// import mongoose from "mongoose";
//import { UserWordModel } from "../userWords/userWordsModel";
import { ObjectId } from "mongodb";
import { WordModel, WordSchema, Word, UserWordsModel } from "./wordModel";
//import { getUser } from '../users/userCont';
import jwt from 'jwt-simple';

//get all words of all users
export async function getWords(req: any, res: any) {
    try {
        const wordsDB = await WordModel.find({}) //bring all words from DB
        res.send({ words: wordsDB })
    } catch (error) {
        console.error(error);
    }
} //work ok

export async function addWord(req: any, res: any) {
    try {
        //get user id from cookie
        const userID: string = req.cookies.user;  //unique id. get the user id from the cookie - its coded!
        if (!userID) throw new Error("At WordsCont addWord: userID not found in cookie");
        console.log('At addWord the userID from cookies: ', { userID });

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("At userCont getUser: Couldn't load secret from .env");

        const decodedUserId = jwt.decode(userID, secret);
        console.log('At userCont getUser the decodedUserId:', decodedUserId)

        const { en_word, he_word } = req.body;
        console.log({ en_word, he_word });  // work
        if (!en_word || !he_word) throw new Error("At wordCont addWord: Please complete all fields");

        //create new word with using mongoose
        const word = new WordModel({ en_word, he_word });
        console.log("At wordCont addWord word at line 40: ", word)

        let wordDBid;
        //check if the word exist on word-DB
        const isWordExist = await WordModel.findOne({ en_word: en_word, he_word: he_word })
        if (isWordExist) {
            console.log("This word already exist in word-DB")
            wordDBid = isWordExist._id
            console.log("At wordCont addWord wordDBid at line 48: ", wordDBid)
        } else {
            word.save() //save the new word in word-DB
            wordDBid = word._id
            console.log("At wordCont addWord wordDBid at line 52: ", wordDBid)
        }

        //check if the words already in the userWordsDB -> work 
        const existingUserWord = await UserWordsModel.findOne({ wordsId: wordDBid, userId: decodedUserId })
        if (existingUserWord) throw new Error("At wordCont addWord: the word already exist in your DB")
        else {
            const newUserWordDB = await UserWordsModel.create({
                wordsId: wordDBid,
                userId: decodedUserId
            }); // save the new word in the user-word-DB
            console.log("At wordCont addWord newUserWordDB at line 63: ", newUserWordDB) //--> work
        }
       
        //query the DB to retrieve all the user words
        const userWords = await UserWordsModel.find({ userId: decodedUserId })  //bring all user-words from DB 
        console.log("At wordCont addWord userWords line 69: ", userWords) 

        //send the new word array to user
        if (userWords === undefined) throw new Error("At wordCont addWord line 63: userWordsArr is undefine or empty ");

        res.send({ ok: true, words: userWords }); 

    } catch (error) {
        console.error(error);
    }
} //work ok

//get word by wordID
export async function getWordByID(wordDBid: string | ObjectId) {
    try {
        const wordsDB = await WordModel.findOne({ _id: wordDBid}) //bring the word from DB
        console.log("at getWordByID the wordsDB:", wordsDB)
        return ({ word: wordsDB })
    } catch (error) {
        console.error(error);
    }
} //work ok

export async function updateWord(req: any, res: any) {
    try {
        const wordID = req.params.wordID
        if (!wordID) throw new Error("no word id in params updateWord");
        console.log("at wordCont/updateWord the wordID:", wordID)
        
        const {en_word, he_word} = req.body
        if (!en_word || !he_word) throw new Error("no word in body");

        //find the word in DB by word_id
        const wordExist = await WordModel.findOne({ _id: wordID })
        if (!wordExist) throw new Error("word not found");
        
        //update the existing word with the new data from client
        wordExist.en_word = en_word
        wordExist.he_word = he_word

        const updatedWord = await wordExist.save() //save the update in DB

        res.send({ok: true, results: updatedWord})

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
} //work ok

// delete word from DB (admin only)
//1. delete the word by id from all user-word-model (no need for userID)
//2. delete the word by id from word-model
export async function deleteWordById(req: any, res: any) {
    try { 
      const wordID = req.params.wordID;
      if (!wordID) throw new Error("no word id in params deleteUserWord");
      console.log("at wordCont/deleteUserWord the wordID:", wordID);
  
      if (await UserWordsModel.findOneAndDelete({ wordsId: wordID })){
        if(await WordModel.findOneAndDelete({ _id: wordID })){
        res.send({ ok: true, massage: "the word deleted successfully" });
      }} else {
        res.send({ok: false, massage: "the word was not deleted"})
      }
    } catch (error) {
      console.error(error, "at wordCont/deleteUserWord delete failed");
    }
  }