"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneDataFromMongoDB = exports.updateOneDataOnMongoDB = exports.getXRandomDataList = exports.getOneDataFromJoinCollectionInMongoDB = exports.getOneDataFromMongoDB = exports.getAllDataFromMongoDB = exports.createAndSaveDataToMongoDB = exports.saveDataToMongoDB = void 0;
const mongodb_1 = require("mongodb");
//create
const saveDataToMongoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield data.save();
        console.log("at mongoCRUD/saveData the response is:", response);
        if (response) {
            return { ok: true, response };
        }
    }
    catch (error) {
        console.error(error);
        return { ok: false, error: error.message };
    }
}); //work ok
exports.saveDataToMongoDB = saveDataToMongoDB;
//only for join collection
const createAndSaveDataToMongoDB = (modelName, library1Name, // name of library 1
library2Name, // name of library 2
item1ID, // object from library 1
item2ID // object from library 2
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/createAndSaveData the item1ID is:", item1ID);
        console.log("at mongoCRUD/createAndSaveData the item2ID is:", item2ID);
        console.log("at mongoCRUD/createAndSaveData the modelName is:", modelName);
        console.log("at mongoCRUD/createAndSaveData the item1IdName is:", library1Name);
        console.log("at mongoCRUD/createAndSaveData the item2IdName is:", library2Name);
        if (!item1ID || !item2ID) {
            throw new Error("Invalid item1ID or item2ID");
        }
        const newJoinData = yield modelName.create({
            [library1Name]: item1ID,
            [library2Name]: item2ID,
        }); // save the new join in the join-DB
        console.log("at mongoCRUD/createAndSaveData the newJoinData is:", newJoinData);
        const response = yield (0, exports.saveDataToMongoDB)(newJoinData);
        console.log("at mongoCRUD/createAndSaveData the response is:", response);
        if (response) {
            return { ok: true, response };
        }
    }
    catch (error) {
        console.error(error);
        return { ok: false, error: error.message };
    }
}); //work ok
exports.createAndSaveDataToMongoDB = createAndSaveDataToMongoDB;
//read - get all - find all
const getAllDataFromMongoDB = (modelName, filterCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/getAllData the modelName is:", modelName);
        const response = yield modelName.find(filterCriteria);
        console.log("at mongoCRUD/getAllData the response is:", response);
        if (response) {
            return { ok: true, response };
        }
        else {
            return { ok: false };
        }
    }
    catch (error) {
        console.error(error);
        return { ok: false, error: error.message };
    }
    try {
        console.log("at mongoCRUD/getAllData the modelName is:", modelName);
        const response = yield modelName.find({});
        if (response.length > 0) {
            return { ok: true, response };
        }
        else {
            return { ok: true, response: [] };
        }
    }
    catch (error) {
        console.error(error);
        return { ok: false, error: error.message };
    }
}); //work ok
exports.getAllDataFromMongoDB = getAllDataFromMongoDB;
//read - get one - find one
const getOneDataFromMongoDB = (modelName, filterCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/getOneData the modelName is:", modelName);
        const response = yield modelName.findOne(filterCriteria);
        console.log("at mongoCRUD/getOneData the response is:", response);
        if (response) {
            return { ok: true, response };
        }
    }
    catch (error) {
        console.error(error);
        return { ok: false, error: error.message };
    }
}); //work ok
exports.getOneDataFromMongoDB = getOneDataFromMongoDB;
//read - get by id
const getOneDataFromJoinCollectionInMongoDB = (modelName, filterCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/getDataByID the modelName:", modelName);
        console.log("at mongoCRUD/getDataByID the filterCriteria:", filterCriteria);
        // Check if userId is a string and convert it to ObjectId
        if (typeof filterCriteria.userId === 'string') {
            filterCriteria.userId = new mongodb_1.ObjectId(filterCriteria.userId);
            console.log("at mongoCRUD/getDataByID the new filterCriteria:", filterCriteria);
        }
        const response = yield modelName.findOne(filterCriteria);
        console.log("at mongoCRUD/getDataByID the response is:", response);
        if (response) {
            return { ok: true, response };
        }
        else {
            return { ok: false, error: "No document found" };
        }
    }
    catch (error) {
        console.error(error);
        return { ok: false, error: error.message };
    }
}); //work ok
exports.getOneDataFromJoinCollectionInMongoDB = getOneDataFromJoinCollectionInMongoDB;
//read - get a list of items by field (aggregate)
const getXRandomDataList = (modelName, modelId, IdMongoose, listLength, dbName, localFieldName, foreignFieldName, itemName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/getDataByID the modelName:", modelName);
        console.log("at mongoCRUD/getDataByID the modelId:", modelId);
        console.log("at mongoCRUD/getDataByID the IdMongoose:", IdMongoose);
        console.log("at mongoCRUD/getDataByID the listLength:", listLength);
        console.log("at mongoCRUD/getDataByID the dbName:", dbName);
        console.log("at mongoCRUD/getDataByID the localFieldName:", localFieldName);
        console.log("at mongoCRUD/getDataByID the foreignFieldName:", foreignFieldName);
        console.log("at mongoCRUD/getDataByID the itemName:", itemName);
        const response = yield modelName.aggregate([
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
            console.log("at mongoCRUD/getXRandomDataList the response:", response);
            return ({ ok: true, response });
        }
        else {
            return ({ ok: false });
        }
    }
    catch (error) {
        console.error(error);
        return ({ ok: false, error: error.message });
    }
}); //work ok
exports.getXRandomDataList = getXRandomDataList;
//update
const updateOneDataOnMongoDB = (modelName, filter, update) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/updateOneData the modelName", modelName);
        console.log("at mongoCRUD/updateOneData the filter", filter);
        console.log("at mongoCRUD/updateOneData the update", update);
        const response = yield modelName.findOneAndUpdate(filter, update, { new: true });
        //By default, findOneAndUpdate() returns the document as it was before update was applied.
        //You should set the new option to true to return the document after update was applied
        if (response) {
            console.log("at mongoCRUD/updateOneData the response", response);
            return ({ ok: true, response, massage: "The word update successfully" });
        }
        else {
            return ({ ok: false, massage: "The word not exist nor update" });
        }
    }
    catch (error) {
        console.error(error);
        return ({ ok: false, error: error.message });
    }
}); //work ok
exports.updateOneDataOnMongoDB = updateOneDataOnMongoDB;
//delete
//item is uniq
const deleteOneDataFromMongoDB = (modelName, item) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield modelName.findOneAndDelete({ item });
        if (response) {
            return ({ ok: true });
        }
        else {
            return ({ ok: false });
        }
    }
    catch (error) {
        console.error(error);
        return ({ ok: false, error: error.message });
    }
}); //work ok
exports.deleteOneDataFromMongoDB = deleteOneDataFromMongoDB;
//# sourceMappingURL=mongoCRUD.js.map