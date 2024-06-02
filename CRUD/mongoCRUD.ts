import mongoose, { Model, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { IUserWordDoc, MyJoinCollection } from "../API/words/wordModel";
export interface JoinDocument {
  item1ID: ObjectId;
  item2ID: ObjectId;
  _id?: ObjectId;
}
// Define the shape of your document
interface MyDocument<T extends Document> extends Document<any, any, T> {}

//create
export const saveData = async (req: any, res: any, modelName) => {
  try {
    const response = await modelName.save();
    console.log("at mongoCRUD/saveData the response is:", response);
    if (response) {
      return { ok: true, response };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, error: error.message };
  }
}; //work ok

export const createAndSaveData = async <T extends MyDocument<IUserWordDoc>>(
  req: any,
  res: any,
  modelName: Model<MyJoinCollection<T>>,
  item1IdName: string,
  item2IdName: string,
  item1ID: ObjectId,
  item2ID: ObjectId
) => {
  try {
    console.log("at mongoCRUD/createAndSaveData the item1ID is:", item1ID);
    console.log("at mongoCRUD/createAndSaveData the item2ID is:", item2ID);
    console.log("at mongoCRUD/createAndSaveData the modelName is:", modelName);
    console.log(
      "at mongoCRUD/createAndSaveData the item1IdName is:",
      item1IdName
    );
    console.log(
      "at mongoCRUD/createAndSaveData the item2IdName is:",
      item2IdName
    );

    if (!item1ID || !item2ID) {
      throw new Error("Invalid item1ID or item2ID");
    }

    const newJoinData = await modelName.create({
      [item1IdName]: item1ID,
      [item2IdName]: item2ID,
    }); // save the new join in the join-DB
    console.log(
      "at mongoCRUD/createAndSaveData the newJoinData is:",
      newJoinData
    );

    const response = await newJoinData.save();
    console.log("at mongoCRUD/createAndSaveData the response is:", response);

    if (response) {
      return { ok: true, response };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, error: error.message };
  }
}; //work ok

//read - get all - find all
export const getAllData = async <T extends Document>(
  req: any,
  res: any,
  modelName: Model<MyDocument<T>>,
  filterCriteria?: Record<string, any>
) => {
  try {
    console.log("at mongoCRUD/getAllData the modelName is:", modelName);
    const response = await modelName.find(filterCriteria);
    console.log("at mongoCRUD/getAllData the response is:", response);
    if (response) {
      return { ok: true, response };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, error: error.message };
  }
  try {
    console.log("at mongoCRUD/getAllData the modelName is:", modelName);
    const response = await modelName.find({});
    if (response.length > 0) {
      return { ok: true, response };
    } else {
      return { ok: true, response: [] };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, error: error.message };
  }
}; //work ok

//read - get one - find one
export const getOneData = async <T extends Document>(
  req: any,
  res: any,
  modelName: Model<MyDocument<T>>,
  filterCriteria: Record<string, any>
) => {
  try {
    console.log("at mongoCRUD/getOneData the modelName is:", modelName);
    const response = await modelName.findOne(filterCriteria);
    console.log("at mongoCRUD/getOneData the response is:", response);
    if (response) {
      return { ok: true, response };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, error: error.message };
  }
}; //work ok

//read - get by id
export const getDataByID = async <T extends Document>(
  modelName: Model<MyDocument<T>>,
  filterCriteria: ObjectId | string
  // filterCriteria: Record<string, any>
  // item: any
) => {
  try {
    console.log("at mongoCRUD/getDataByID the modelName:", modelName)
    console.log("at mongoCRUD/getDataByID the filterCriteria:", filterCriteria)
    // const response = await modelName.findById({ item });
    const response = await modelName.findById(filterCriteria);
    console.log("at mongoCRUD/getDataByID the response is:", response);
    if (response) {
      return { ok: true, response };
    } else {
      return { ok: false, error: "No document found" };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, error: error.message };
  }
};

//read - get a list of items by field (aggregate)
export const getXRandomDataList = async <T extends Document>(
  req: any,
  res: any,
  modelName: Model<MyDocument<T>>,
  modelId: string,
  IdMongoose: string,
  listLength: number,
  dbName: string,
  localFieldName: string,
  foreignFieldName: string,
  itemName: string
) => {
  try {
    const response = await modelName.aggregate([
      { $match: { modelId: IdMongoose } },
      { $sample: { size: listLength } },
      {
        $lookup: {
          from: dbName,
          localField: localFieldName,
          foreignField: foreignFieldName,
          as: itemName,
        },
      },
    ]);
    if (response) {
      res.send({ ok: true, response });
    } else {
      res.send({ ok: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ ok: false, error: error.message });
  }
};

//update
export const updateOneData = async <T extends Document>(
  req: any,
  res: any,
  modelName: Model<MyDocument<T>>,
  item: any
) => {
  try {
    const response = await modelName.findOneAndUpdate({ item });
    if (response) {
      res.send({ ok: true });
    } else {
      res.send({ ok: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ ok: false, error: error.message });
  }
};

//delete
//item is uniq
export const deleteOneData = async <T extends Document>(
  req: any,
  res: any,
  modelName: Model<MyDocument<T>>,
  item: any
) => {
  try {
    const response = await modelName.findOneAndDelete({ item });
    if (response) {
      res.send({ ok: true });
    } else {
      res.send({ ok: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ ok: false, error: error.message });
  }
};
