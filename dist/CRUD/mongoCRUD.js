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
exports.deleteOneData = exports.updateOneData = exports.getXRandomDataList = exports.getDataByID = exports.getOneData = exports.getAllData = exports.createAndSaveData = exports.saveData = void 0;
//create
const saveData = (modelName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield modelName.save();
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
exports.saveData = saveData;
const createAndSaveData = (req, res, modelName, item1IdName, item2IdName, item1ID, item2ID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/createAndSaveData the item1ID is:", item1ID);
        console.log("at mongoCRUD/createAndSaveData the item2ID is:", item2ID);
        console.log("at mongoCRUD/createAndSaveData the modelName is:", modelName);
        console.log("at mongoCRUD/createAndSaveData the item1IdName is:", item1IdName);
        console.log("at mongoCRUD/createAndSaveData the item2IdName is:", item2IdName);
        if (!item1ID || !item2ID) {
            throw new Error("Invalid item1ID or item2ID");
        }
        const newJoinData = yield modelName.create({
            [item1IdName]: item1ID,
            [item2IdName]: item2ID,
        }); // save the new join in the join-DB
        console.log("at mongoCRUD/createAndSaveData the newJoinData is:", newJoinData);
        const response = yield newJoinData.save();
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
exports.createAndSaveData = createAndSaveData;
//read - get all - find all
const getAllData = (req, res, modelName, filterCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/getAllData the modelName is:", modelName);
        const response = yield modelName.find(filterCriteria);
        console.log("at mongoCRUD/getAllData the response is:", response);
        if (response) {
            return { ok: true, response };
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
exports.getAllData = getAllData;
//read - get one - find one
const getOneData = (req, res, modelName, filterCriteria) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getOneData = getOneData;
//read - get by id
const getDataByID = (modelName, filterCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("at mongoCRUD/getDataByID the modelName:", modelName);
        console.log("at mongoCRUD/getDataByID the filterCriteria:", filterCriteria);
        const response = yield modelName.findById(filterCriteria);
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
exports.getDataByID = getDataByID;
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
const updateOneData = (modelName, filter, update) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.updateOneData = updateOneData;
//delete
//item is uniq
const deleteOneData = (modelName, item) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteOneData = deleteOneData;
//# sourceMappingURL=mongoCRUD.js.map