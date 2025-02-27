import fs from "fs";
import path from "path";
import jwt from "jwt-simple";
import { Response } from "express";
import { Document, ObjectId } from "mongoose";
import {
  deleteOneDataFromMongoDB,
  getAllDataFromMongoDB,
  getOneDataFromJoinCollectionInMongoDB,
  getXRandomDataList,
} from "../../CRUD/mongoCRUD";
import { IUserWordDoc, UserWordsModel, WordModel } from "./../words/wordModel";

let ObjectId = require("mongoose").Types.ObjectId;

interface UserWordDocument extends Document {
  id: string;
  wordsId: ObjectId;
  userId: ObjectId;
  // Add any other properties you need
}

// function createUserWordDocument(
//   id: string,
//   wordsId: ObjectId,
//   userId: ObjectId
// ): UserWordDocument {
//   const userWordDocument: UserWordDocument = Object.create(
//     Object.getPrototypeOf({})
//   );
//   Object.defineProperties(userWordDocument, {
//     id: { value: id, enumerable: true },
//     wordsId: { value: wordsId, enumerable: true },
//     userId: { value: userId, enumerable: true },
//     // Define any other properties you need
//   });
//   return userWordDocument;
// }

export async function getAllUsersWords(req: any, res?: any) {
  try {
    //get user id from cookie
    console.log("hello from server getAllUserWords function");
    const userID: string = req.cookies.user; //unique id. get the user id from the cookie - its coded!
    if (!userID)
      throw new Error(
        "At userWordsCont getAllUsersWords: userID not found in cookie"
      );
    console.log("At userWordsCont getUserWords the userID from cookies: ", {
      userID,
    }); //work ok

    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error(
        "At userWordsCont getAllUsersWords: Couldn't load secret from .env"
      );

    const decodedUserId = jwt.decode(userID, secret);
    console.log(
      "At userWordsCont getAllUsersWords the decodedUserId:",
      decodedUserId
    ); //work ok

    // const allUserWordsIDFromDBs = await UserWordsModel.find({userId: decodedUserId}); //get all users word into array of objects with the id of the words not the words themselves
    const userWordDocResult = await getAllDataFromMongoDB(UserWordsModel, {
      userId: decodedUserId,
    });
    if (!userWordDocResult.ok) throw new Error(userWordDocResult.error);
    console.log(
      "At userWordsCont getAllUsersWords the userWordDocResult:",
      userWordDocResult
    );

    //@ts-ignore
    const userWordArray1: UserWordDocument[] = userWordDocResult.response;
    console.log(
      "At userWordsCont getAllUsersWords the userWordArray1:",
      userWordArray1
    );

    const allUserWordsArray = await userWordArray1.map((e) =>
      getOneDataFromJoinCollectionInMongoDB(WordModel, e.wordsId)
    );
    console.log(
      "At userWordsCont getAllUsersWords the allUserWordsArray:",
      allUserWordsArray
    );

    const allUserWordsData = await Promise.all(
      allUserWordsArray.map(async (promise) => await promise)
    );
    console.log(
      "At userWordsCont getAllUsersWords the allUserWordsData:",
      allUserWordsData
    );

    const extractedResponses = allUserWordsData.map((e) => e.response);
    console.log(
      "At userWordsCont getAllUsersWords the response:",
      extractedResponses
    );

    // If `res` is provided, it means the function was called as an API endpoint
    if (res) {
      return res.send({ ok: true, words: extractedResponses });
    }

    // Otherwise, return the data for internal use (like in exportUserWordsAsCSV)
    return extractedResponses;

    } catch (error) {
    console.error(error);
    if (res) {
      return res.status(500).send({ ok: false, error: error.message });
    }
    throw error; // Rethrow error if called without `res`
  }
} //work ok

//get X random words from the user words in the DB
export async function getXRandomUserWords(req: any, res: any) {
  try {
    //get user id from cookie
    const userID: string = req.cookies.user; //unique id. get the user id from the cookie - its coded!
    if (!userID)
      throw new Error(
        "At userWordsCont/getXRandomUserWords: userID not found in cookie"
      );
    console.log(
      "At userWordsCont/getXRandomUserWords the userID from cookies: ",
      {
        userID,
      }
    );

    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error(
        "At userWordsCont/getXRandomUserWords: Couldn't load secret from .env"
      );

    const decodedUserId = jwt.decode(userID, secret);
    console.log(
      "At userWordsCont/getXRandomUserWords the decodedUserId:",
      decodedUserId
    );

    const userIdMongoose = new ObjectId(decodedUserId);
    console.log(
      "At userWordsCont/getXRandomUserWords the userIdMongoose:",
      userIdMongoose
    );

    const userWordsListResult = await getXRandomDataList(
      UserWordsModel,
      "userId",
      userIdMongoose,
      10,
      "words",
      "wordsId",
      "_id",
      "word"
    );
    console.log(
      "At userWordsCont/getXRandomUserWords the userWordsListResult:",
      userWordsListResult
    );

    const userWordsList = userWordsListResult.response;
    console.log(
      "At userWordsCont/getXRandomUserWords the userWordsList:",
      userWordsList
    );

    const wordList = userWordsList.map((e) => e.word[0]);
    console.log("At userWordsCont/getXRandomUserWords the wordList:", wordList);

    res.send({ ok: true, words: wordList });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, error: error.message });
  }
} //work ok

//delete word from user
export async function deleteUserWord(req: any, res: any) {
  try {
    const userID: string = req.cookies.user; //unique id. get the user id from the cookie - its coded!
    if (!userID)
      throw new Error(
        "At userWordsCont getUserWords: userID not found in cookie"
      );
    console.log("At userWordsCont getUserWords the userID from cookies: ", {
      userID,
    });

    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error(
        "At userWordsCont getUserWords: Couldn't load secret from .env"
      );

    const decodedUserId = jwt.decode(userID, secret);
    console.log(
      "At userWordsCont getUserWords the decodedUserId:",
      decodedUserId
    );

    const wordID = req.params.wordID;
    if (!wordID) throw new Error("no word id in params deleteUserWord");
    console.log("at wordCont/deleteUserWord the wordID:", wordID);

    if (
      await deleteOneDataFromMongoDB(UserWordsModel, {
        wordsId: wordID,
        userId: decodedUserId,
      })
    ) {
      res.send({ ok: true, massage: "the word deleted from user" });
    } else {
      res.send({ ok: false, massage: "the word not deleted from user" });
    }
  } catch (error) {
    console.error(error, "at wordCont/deleteUserWord delete failed");
  }
} //work ok

//export user-words to csv file
export async function exportUserWordsAsCSV(req: any, res: Response) {
  try {
    console.log("Exporting user words to CSV...");

    // Get user words using the existing getAllUsersWords() function
    const mockRes = {
      send: (data: any) => data, // Intercept send to capture the response
      status: (code: number) => ({
        json: (data: any) => ({ ...data, status: code }),
      }),
    };

    const userWordsResponse: any = await getAllUsersWords(req, mockRes);
    if (!userWordsResponse.ok || !userWordsResponse.words.length) {
      return res.status(404).json({ error: "No words found for this user" });
    }
    console.log("userWordsResponse:", userWordsResponse);
    console.log("userWordsResponse.ok:", userWordsResponse.ok);
    console.log("userWordsResponse.words:", userWordsResponse.words);

    const userWords = userWordsResponse.words;

    // Convert data to CSV format
    const headers = ["English Word", "Hebrew Word"];
    const csvRows = userWords.map(
      (word: any) =>
        `"${word.en_word.replace(/"/g, '""')}", "${word.he_word.replace(
          /"/g,
          '""'
        )}"`
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // Save to a temporary CSV file
    const filePath = path.join(__dirname, `UserWords_${Date.now()}.csv`);
    fs.writeFileSync(filePath, "\uFEFF" + csvContent, "utf8");

    // Send the file to the client
    res.download(filePath, `UserWords.csv`, () => {
      fs.unlinkSync(filePath); // Delete file after sending
    });
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ error: "Failed to export user words" });
  }
} //work ok
