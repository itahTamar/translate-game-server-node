import jwt from "jwt-simple";
import { WordModel, UserWordsModel } from "./../words/wordModel";
var ObjectId = require('mongoose').Types.ObjectId;  

// export async function getUserWords(req:any, res:any) { //work
//     try {
//         //get user id from cookie
//         const userID: string = req.cookies.user;  //unique id. get the user id from the cookie - its coded!
//         if (!userID) throw new Error("At userWordsCont getUserWords: userID not found in cookie");
//         console.log('At userWordsCont getUserWords the userID from cookies: ', { userID });

//         const secret = process.env.JWT_SECRET;
//         if (!secret) throw new Error("At userWordsCont getUserWords: Couldn't load secret from .env");

//         const decodedUserId = jwt.decode(userID, secret);
//         console.log('At userWordsCont getUserWords the decodedUserId:', decodedUserId)

//         const userWordsDBs = await UserWordsModel.find({userId: decodedUserId});  //work
//         console.log("At userWordsCont getUserWords the userWordsDB:",userWordsDBs )

//         // const userWordsArr = await Promise.all(
//         //     userWordsDBs.map(async (userWordsDB) => {
//         //         const word = await WordModel.findById(userWordsDB.wordsId);
//         //         return word;
//         //     })
//         // );

//         const userWordsArr = await UserWordsModel.aggregate([
//             {
//                 $match: {
//                     userId: decodedUserId,
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "words", // Replace with the actual name of your words collection
//                     localField: "wordsId",
//                     foreignField: "_id",
//                     as: "word",
//                 },
//             },
//             {
//                 $unwind: "$word", // If there is a one-to-one relationship, you can skip this stage
//             },
//             {
//                 $project: {
//                     word: 1, // Include only the "word" field in the final output
//                 },
//             },
//         ]);

//         console.log("At userWordsCont getUserWords the userWordsArr:", userWordsArr)
//         res.send({words: userWordsArr}); //work

//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: error.message });
//     }
// }
export async function getUserWordsGili(req: any, res: any) {
  //work
  try {
    //get user id from cookie
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

    const userIdMongoose = new ObjectId (decodedUserId)
    const userWordsModel = await UserWordsModel.aggregate([
      { $match: { userId: userIdMongoose } },
      { $sample: { size: 3 } },
      {$lookup: {from: 'words', localField: 'wordsId', foreignField: "_id", as: "word"}}
    ]);

    res.send({ words: userWordsModel }); //work
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
}
