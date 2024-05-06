import jwt from "jwt-simple";
import { WordModel, UserWordsModel } from "./../words/wordModel";
var ObjectId = require('mongoose').Types.ObjectId;  

export async function getAllUsersWords(req:any, res:any) { 
    try {
        //get user id from cookie
        const userID: string = req.cookies.user;  //unique id. get the user id from the cookie - its coded!
        if (!userID) throw new Error("At userWordsCont getAllUsersWords: userID not found in cookie");
        console.log('At userWordsCont getUserWords the userID from cookies: ', { userID });

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("At userWordsCont getAllUsersWords: Couldn't load secret from .env");

        const decodedUserId = jwt.decode(userID, secret);
        console.log('At userWordsCont getAllUsersWords the decodedUserId:', decodedUserId)

        const allUserWordsFromDBs = await UserWordsModel.find({userId: decodedUserId});  //get all users word into array of objects 
        console.log("At userWordsCont getAllUsersWords the allUserWordsFromDBs:",allUserWordsFromDBs )
        
        res.send({ok: true, words: allUserWordsFromDBs}); 

    } catch (error) {
        console.error(error);
        res.status(500).send({ok: false, error: error.message });
    }
} //work ok

//get X random words from the user words in the DB
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
      { $sample: { size: 3 } },  //chang the size to get a different number of words
      {$lookup: {from: 'words', localField: 'wordsId', foreignField: "_id", as: "word"}}
    ]);

    res.send({ words: userWordsModel }); //work
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
}
