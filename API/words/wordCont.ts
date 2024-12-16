import jwt from "jwt-simple";
import { createAndSaveDataToMongoDB, getAllDataFromMongoDB, saveDataToMongoDB, updateOneDataOnMongoDB, getOneDataFromJoinCollectionInMongoDB } from "../../CRUD/mongoCRUD";
import { getOneDataFromMongoDB } from "./../../CRUD/mongoCRUD";
import { IWordDocument, UserWordsModel, WordModel } from "./wordModel";

//get all words of all users
export async function getWords(req: any, res: any) {
  try {
    console.log("hello from getWords");
    //@ts-ignore
    // const wordsDB = await getAllDataFromMongoDB<IWordDocument>(WordModel);
    const wordsDB = await getAllDataFromMongoDB<any>(WordModel);
    res.send({ words: wordsDB });
  } catch (error) {
    console.error(error);
  }
} //work ok

export async function addWord(req: any, res: any) {
  try {
    //get user id from cookie
    const userID: string = req.cookies.user; //unique id. get the user id from the cookie - its coded!
    if (!userID)
      throw new Error("At WordsCont addWord: userID not found in cookie");
    console.log("At addWord the userID from cookies: ", { userID }); //work ok
    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error("At wordCont addWord: Couldn't load secret from .env");
    const decodedUserId = jwt.decode(userID, secret);
    console.log("At wordCont addWord the decodedUserId:", decodedUserId); //work ok
    const { en_word, he_word } = req.body;
    console.log("At wordCont/addWord the req.body:", { en_word, he_word }); // work ok
    if (!en_word || !he_word)
      throw new Error("At wordCont addWord: Please complete all fields")
    const en_word_lowCase = en_word.toLowerCase()  //convert the characters within a string to lowercase
    console.log("At wordCont/addWord the en_word_lowCase:", en_word_lowCase); // work ok

    //create new word with using mongoose
    const word = new WordModel({ en_word: en_word_lowCase, he_word });
    console.log("At wordCont/addWord word:", word); //work ok
    let wordDBid;
    //check if the word exist on word-DB
    const isWordExist = await getOneDataFromMongoDB<IWordDocument>(WordModel, {
      en_word: word.en_word,
      he_word: word.he_word,
    });
    console.log("At wordCont/addWord isWordExist:", isWordExist); //isWordExist: {ok: true, response: {_id: , en_word:"" , he_word: ""}} or {ok: false}
    if (isWordExist.ok) {
      console.log("This word already exist in word-DB");
      wordDBid = isWordExist.response._id;
      console.log("At wordCont/addWord wordDBid:", wordDBid);
    } else {
      //save the new word in word-DB
      const ok = saveDataToMongoDB(word); //work ok
      if (!ok) throw new Error("at addWord Fails to save the word in word-db");
      wordDBid = word._id;
      console.log("At wordCont/addWord wordDBid:", wordDBid);
    }
    //check if the words already in the userWordsDB -> work
    const existingUserWord = await getOneDataFromJoinCollectionInMongoDB(
      UserWordsModel, { wordsId: wordDBid, userId: decodedUserId });
    console.log("At wordCont/addWord existingUserWord:", existingUserWord);
    let message: string;
    if (existingUserWord.ok) {
      console.log("At wordCont addWord: the word already exist in your DB");
      message = "The word already exist in your vocabulary";
    } else {
      const newUserWordDB = await createAndSaveDataToMongoDB(
        UserWordsModel,
        "wordsId",
        "userId",
        wordDBid,
        decodedUserId
      ); // save the new word in the user-word-DB
      console.log("At wordCont addWord newUserWordDB:", newUserWordDB); //--> work
      message = "The word was successfully saved";
    }
    //query the DB to retrieve all the user words
    const userWords = await getAllDataFromMongoDB(
      UserWordsModel,
      { userId: decodedUserId }
    ); //bring all user-words from DB
    console.log("At wordCont/addWord userWords:", userWords);
    //send the new word array to user
    if (userWords === undefined)
      throw new Error(
        "At wordCont addWord line 63: userWordsArr is undefine or empty "
      );
    res.send({ ok: true, words: userWords, message });
  } catch (error) {
    console.error(error);
  }
} //work ok

//!get one word by wordID - not use
// export async function getWordByID(wordDBid: string | ObjectId) {
//   try {
//     // const wordDB = await getDataByID(WordModel, wordDBid); //bring the word from DB
//     const wordDB = await WordModel.findOne({ _id: wordDBid }); //bring the word from DB
//     console.log("at getWordByID the wordDB:", wordDB);
//     return { word: wordDB };
//   } catch (error) {
//     console.error(error);
//   }
// } 


//update thw word in words.db (will update for all users using this word)
export async function updateWordFieldByWordId(req: any, res: any) {
  try {
    const wordID = req.params.wordID;
    if (!wordID) throw new Error("no word id in params updateWord");
    console.log("at wordCont/updateWordFieldByWordId the wordID:", wordID);

    const { field } = req.body;
    console.log("at wordCont/updateWordFieldByWordId the field:", field); //ok

    const { updateData } = req.body;

    if (!field || !updateData) throw new Error("missing data required field or updateData");

    const updateWordData = {[field]: updateData}
    console.log("at wordCont/updateWordFieldByWordId the updateWordData:", updateWordData);
    
    //find the word in DB by word_id and update the require field
    const wordExistAndUpdate = await updateOneDataOnMongoDB(WordModel, { _id: wordID }, updateWordData)
    console.log("at wordCont/updateWordFieldByWordId the wordExistAndUpdate", wordExistAndUpdate)
      res.send(wordExistAndUpdate); 
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
} //work ok

//old virion
// export async function updateWord(req: any, res: any) {
//   try {
//     const wordID = req.params.wordID;
//     if (!wordID) throw new Error("no word id in params updateWord");
//     console.log("at wordCont/updateWord the wordID:", wordID);

//     const { en_word, he_word } = req.body;
//     if (!en_word || !he_word) throw new Error("no word in body");

//     const updateWordData = {en_word, he_word}

//     //find the word in DB by word_id and update
//     const wordExistAndUpdate = await updateOneDataOnMongoDB(WordModel, { _id: wordID }, updateWordData)
//     console.log("at wordCont/updateWord the wordExistAndUpdate", wordExistAndUpdate)
//       res.send(wordExistAndUpdate);
//       //at wordCont/updateWord the wordExistAndUpdate {
//           //   ok: true,
//           //   response: {
//           //        _id: new ObjectId("66571ff99d66a29097bae66d"),
//           //        en_word: 'the update en_word',
//           //        he_word:'the update he_word',
//           //        __v: 0
//           //   },
//           //   massage: 'The word update successfully'
//           // }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error.message });
//   }
// } //work ok

//! delete word from all DB (admin only) - not use yet
//1. delete the word by id from all user-word-model (no need for userID)
//2. delete the word by id from word-model
// export async function deleteWordById(req: any, res: any) {
//   try {
//     const wordID = req.params.wordID;
//     if (!wordID) throw new Error("no word id in params deleteUserWord");
//     console.log("at wordCont/deleteUserWord the wordID:", wordID);

//     if (await UserWordsModel.findOneAndDelete({ wordsId: wordID })) {
//       if (await WordModel.findOneAndDelete({ _id: wordID })) {
//         res.send({ ok: true, massage: "the word deleted successfully" });
//       }
//     } else {
//       res.send({ ok: false, massage: "the word was not deleted" });
//     }
//   } catch (error) {
//     console.error(error, "at wordCont/deleteUserWord delete failed");
//   }
// }
