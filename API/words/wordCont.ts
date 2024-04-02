//import { UserWordsModel } from './wordModel';
//import { userWordsArr } from './../userWords/userWordsModel';
// import { UserModel, UserSchema } from './../users/userModel';
// import mongoose from "mongoose";
//import { UserWordModel } from "../userWords/userWordsModel";
import { WordModel, WordSchema, Word, UserWordsModel } from "./wordModel";
//import { getUser } from '../users/userCont';
import jwt from 'jwt-simple';

//get
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

        //create new word with using mongoos
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
            word.save() //save the word in word-DB
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
       

        //query the DB to retrive all the user words
        const userWords = await UserWordsModel.find({ userId: decodedUserId })  //bring all user-words from DB 
        console.log("At wordCont addWord userWords line 69: ", userWords) 

        //send the new word array to user
        if (userWords === undefined) throw new Error("At wordCont addWord line 63: userWordsArr is undefine or empty ");

        res.send({ words: userWords }); //*till here everything work ok!

    } catch (error) {
        console.error(error);
    }
} //work ok

//post (add) -> not work
// export async function updateWord(req: any, res: any) {
//     try {
//         //get user id from cookie
//         const userID: string = req.cookies.user;  //unique id. get the user id from the cookie - its coded!
//         if (!userID) throw new Error("At WordsCont addWord: userID not found in cookie");
//         console.log('At addWord the userID from cookies: ', { userID });

//         const secret = process.env.JWT_SECRET;
//         if (!secret) throw new Error("At userCont getUser: Couldn't load secret from .env");

//         const decodedUserId = jwt.decode(userID, secret);
//         console.log('At userCont getUser the decodedUserId:', decodedUserId)

//         const { wrongEnWord, wronginterpretation } = req.body;
//         console.log({ wrongEnWord, wronginterpretation });  // work
//         if (!wrongEnWord || !wronginterpretation) throw new Error("At wordCont addWord: Please complete all filds");

//         //creat new word with using mongoos
//         const word = new WordModel({ wrongEnWord, wronginterpretation });
//         console.log("At wordCont addWord word at line 40: ", word)

//         let wordDBid;
//         //chack if the word exist on word-DB
//         const isWordExist = await WordModel.findOne({ wrongEnWord: wrongEnWord, wronginterpretation: wronginterpretation })
//         if (isWordExist) {
//             console.log("This word alrady exist in word-DB")
//             wordDBid = isWordExist._id
//             console.log("At wordCont addWord wordDBid at line 48: ", wordDBid)
//         } else {
//             word.save() //save the word in word-DB
//             wordDBid = word._id
//             console.log("At wordCont addWord wordDBid at line 52: ", wordDBid)
//         }

//         //chack if the words alredy in the userWordsDB -> work 
//         const existingUserWord = await UserWordsModel.findOne({ wordsId: wordDBid, userId: decodedUserId })
//         if (existingUserWord) throw new Error("At wordCont addWord: the word alredy exist in your DB")
//         else {
//             const newUserWordDB = await UserWordsModel.create({
//                 wordsId: wordDBid,
//                 userId: decodedUserId
//             }); // save the new word in the user-word-DB
//             console.log("At wordCont addWord newUserWordDB at line 63: ", newUserWordDB) //--> work
//         }
       

//         //query the DB to retrive all the user words
//         const userWords = await UserWordsModel.find({ userId: decodedUserId })  //bring all user-words from DB 
//         console.log("At wordCont addWord userWords line 69: ", userWords) 

//         //send the new word array to user
//         if (userWords === undefined) throw new Error("At wordCont addWord line 63: userWordsArr is undefine or emty ");

//         res.send({ words: userWords }); //*till here everything work ok!

//     } catch (error) {
//         console.error(error);
//     }
// }


//delete --> not work
//!to renew this fun --> only for admin in the future
// export async function deleteWord(req: any) {
//     try {
//         const { wrongEnWord, wronginterpretation } = req.body;
//         console.log("At deleteWord the req.body got:",wrongEnWord, wronginterpretation ) //undefined undefined
//         await WordModel.findOneAndDelete(wrongEnWord, wronginterpretation);


//     } catch (error) {
//         console.error(error);
//     }
// }

