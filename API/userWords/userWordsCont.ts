import csv from "csv-parser";
import { Request, Response } from "express";
import fs from "fs";
import jwt from "jwt-simple";
import { Document, ObjectId } from "mongoose";
import multer from "multer";
import path from "path";
import {
  deleteOneDataFromMongoDB,
  getAllDataFromMongoDB,
  getOneDataFromJoinCollectionInMongoDB,
  getXRandomDataList,
} from "../../CRUD/mongoCRUD";
import { UserWordsModel, WordModel } from "./../words/wordModel";
import xlsx from "xlsx";
import { addWord } from "../words/wordCont";

let ObjectId = require("mongoose").Types.ObjectId;
const upload = multer({ dest: "uploads/" });

// Extend Request to include 'file'
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
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

//import user-words from file
export async function importUserWordsFromCSV(req: Request, res: Response) {
  try {
    console.log("Hi from importUserWordsFromCSV");

    // Step 1: Get User ID from cookie
    const userID: string = req.cookies.user;
    if (!userID) throw new Error("User ID not found in cookies");

    // Step 2: Check if File Exists
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const words: { en_word: string; he_word: string }[] = [];

    // Step 3: Handle Different File Types
    if (
      req.file.mimetype === "text/csv" ||
      req.file.originalname.endsWith(".csv")
    ) {
      // Process CSV File
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          if (row.en_word && row.he_word) {
            words.push({ en_word: row.en_word, he_word: row.he_word });
          }
        })
        .on("end", async () => {
          try {
            if (words.length === 0) {
                return res.status(400).json({ message: "No valid words found in file" });
            }
        
            console.log("Words to insert:", words);
        
            const results = [];
            for (const word of words) {
                const result = await addWordDirectly(word.en_word, word.he_word, userID);
                results.push(result);
            }
        
            fs.unlinkSync(filePath); // ✅ Delete file after processing
        
            res.status(200).json({ok: true, message: "Words imported successfully", results });
        } catch (error: any) {
            console.error("Error inserting words into DB:", error);
            res.status(500).json({ok: false, message: "Error importing words", error });
        }
        
        })
        .on("error", (err) => {
          console.error("Error reading CSV:", err);
          res
            .status(500)
            .json({ok: false, message: "Error reading CSV file", error: err });
        });
    } else if (
      req.file.mimetype.includes("spreadsheet") ||
      req.file.originalname.endsWith(".xlsx")
    ) {
      // Process Excel (.xlsx) File
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const sheet = workbook.Sheets[sheetName];
      const excelData = xlsx.utils.sheet_to_json(sheet); // Convert sheet to JSON

      excelData.forEach((row: any) => {
        if (row.en_word && row.he_word) {
          words.push({ en_word: row.en_word, he_word: row.he_word });
        }
      });

      try {
        if (words.length === 0) {
            return res.status(400).json({ok: false, message: "No valid words found in file" });
        }
    
        console.log("Words to insert:", words);
    
        const results = [];
        for (const word of words) {
            const result = await addWordDirectly(word.en_word, word.he_word, userID);
            results.push(result);
        }
    
        fs.unlinkSync(filePath); // Delete file after processing
    
        res.status(200).json({ok: true, message: "Words imported successfully", results });
    } catch (error: any) {
        console.error("Error inserting words into DB:", error);
        res.status(500).json({ok: false, message: "Error importing words", error });
    }
    
    } else {
      return res.status(400).json({ok: false, message: "Unsupported file format" });
    }
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ok: false, message: "Failed to import words", error });
  }
}

export async function addWordDirectly(en_word: string, he_word: string, userID: string) {
  try {
    // Create a fake req object for the `addWord` function
    const fakeReq = {
      cookies: { user: userID },
      body: { en_word, he_word }
    };

    // Create a fake res object to capture the response
    const fakeRes = {
      send: (data: any) => data,  // Simply return data (for resolving the promise)
      status: function (code: number) { 
        this.statusCode = code; 
        return this; 
      },
      json: function (data: any) { return data; }
    };

    // Call `addWord` and wait for it to resolve
    const result = await addWord(fakeReq as any, fakeRes as any);
    return result;
  } catch (error) {
    console.error("Error inserting word into DB:", error);
    throw new Error("Error inserting word");
  }
}
