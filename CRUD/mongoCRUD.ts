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
) => {
  try {
    console.log("at mongoCRUD/getDataByID the modelName:", modelName)
    console.log("at mongoCRUD/getDataByID the filterCriteria:", filterCriteria)
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
}; //work ok

//read - get a list of items by field (aggregate)
export const getXRandomDataList = async <T extends Document>(
  modelName: Model<MyDocument<T>>,
  modelId: string,
  IdMongoose: any,
  listLength: number,
  dbName: string,
  localFieldName: string,
  foreignFieldName: string,
  itemName: string
) => {
  try {
    console.log("at mongoCRUD/getDataByID the modelName:", modelName)
    console.log("at mongoCRUD/getDataByID the modelId:", modelId)
    console.log("at mongoCRUD/getDataByID the IdMongoose:", IdMongoose)
    console.log("at mongoCRUD/getDataByID the listLength:", listLength)
    console.log("at mongoCRUD/getDataByID the dbName:", dbName)
    console.log("at mongoCRUD/getDataByID the localFieldName:", localFieldName)
    console.log("at mongoCRUD/getDataByID the foreignFieldName:", foreignFieldName)
    console.log("at mongoCRUD/getDataByID the itemName:", itemName)

    const response = await modelName.aggregate([
      { $match: { [modelId]: IdMongoose } },
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
      console.log("at mongoCRUD/getXRandomDataList the response:",response)
      return({ ok: true, response });
    } else {
      return({ ok: false });
    }
  } catch (error) {
    console.error(error);
    return({ ok: false, error: error.message });
  }
}; //work ok

//update
export const updateOneData = async <T extends Document>(
  modelName: Model<MyDocument<T>>,
  filter: any,
  update: any,
) => {
  try {
    console.log("at mongoCRUD/updateOneData the modelName", modelName)
    console.log("at mongoCRUD/updateOneData the filter", filter)
    console.log("at mongoCRUD/updateOneData the update", update)
    const response = await modelName.findOneAndUpdate(filter, update, {new: true}); 
//By default, findOneAndUpdate() returns the document as it was before update was applied.
//You should set the new option to true to return the document after update was applied
  if (response) {
    console.log("at mongoCRUD/updateOneData the response", response)
    return({ ok: true, response, massage: "The word update successfully" });
    } else {
      return({ ok: false, massage:"The word not exist nor update" });
    }
  } catch (error) {
    console.error(error);
    return({ ok: false, error: error.message });
  }
};  //work ok

//delete
//item is uniq
export const deleteOneData = async <T extends Document>(
  modelName: Model<MyDocument<T>>,
  item: any
) => {
  try {
    const response = await modelName.findOneAndDelete({ item });
    if (response) {
      return({ ok: true });
    } else {
      return({ ok: false });
    }
  } catch (error) {
    console.error(error);
    return({ ok: false, error: error.message });
  }
}; //work ok
