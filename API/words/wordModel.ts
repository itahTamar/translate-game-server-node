import mongoose, { Document, Model, Schema, model } from "mongoose";
import { UserModel } from "../users/userModel";
// import { MyJoinCollection } from "../../CRUD/mongoCRUD";
import { ObjectId } from "mongodb";
export interface IWordDocument extends Document {
  en_word: string;
  he_word: string;
}
export interface IUserWordDoc extends Document {
  wordsId: ObjectId;
  userId: ObjectId;
}

export interface MyDocument<T extends Document> extends Document<any, any, T> {}

export interface MyJoinCollection<T extends MyDocument<IUserWordDoc>>
  extends Document<any, any, T> {
  _doc: IUserWordDoc;
}
export class Word {
  _id: string | ObjectId;
  en_word: string;
  he_word: string;

  constructor({ en_word, he_word }: { en_word: string; he_word: string }) {
    this.en_word = en_word;
    this.he_word = he_word;
  }
}

//building a schema
export const WordSchema = new Schema({
  en_word: {
    type: String,
    required: true,
  },
  he_word: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now, //set the current date when a word is created
    require: true,
  }
});

// Create a unique compound index for en_word, he_word
WordSchema.index({ en_word: 1, he_word: 1 }, { unique: true });

// export const WordModel = model("word", WordSchema);
export const WordModel: Model<IWordDocument> = model<IWordDocument>(
  "word",
  WordSchema
);
export const words: Word[] = [];

const UserWordsSchema = new mongoose.Schema({
  wordsId: { type: Schema.Types.ObjectId, ref: WordModel },
  userId: { type: Schema.Types.ObjectId, ref: UserModel },
});

// Create a unique compound index for UserWordsSchema
UserWordsSchema.index({ wordsId: 1, userId: 1 }, { unique: true });

export const UserWordsModel: Model<MyJoinCollection<MyDocument<IUserWordDoc>>> =
  model<MyJoinCollection<MyDocument<IUserWordDoc>>>(
    "UserWords",
    UserWordsSchema
  );

