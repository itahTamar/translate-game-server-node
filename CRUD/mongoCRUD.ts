import mongoose, { Model, Document } from 'mongoose';

// Define the shape of your document
interface MyDocument<T extends Document> extends Document<any, any, T> {}

//create
export const addData = async (req: any, res: any, modelName) => {
  try {
    const response = await modelName.save();
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

//read - get one - find one
export const getAllData = async <T extends Document>(req: any, res: any, modelName: Model<MyDocument<T>>) => {
  try {
    console.log("at mongoCRUD/getAllData the modelName is:", modelName)
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
} //work ok

export const getOneData = async <T extends Document>(req: any, res: any, modelName: Model<MyDocument<T>>, item: any) => {
  try {
    console.log("at mongoCRUD/getOneData the modelName is:", modelName)
    const response = await modelName.findOne({ item });
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

//read - get by id
export const getDataByID = async <T extends Document>(req: any, res: any, modelName: Model<MyDocument<T>>, item: any) => {
  try {
    const response = await modelName.findById({ item });
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
export const updateOneData = async <T extends Document>(req: any, res: any, modelName: Model<MyDocument<T>>, item: any) => {
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
export const deleteOneData = async <T extends Document>(req: any, res: any, modelName: Model<MyDocument<T>>, item: any) => {
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
