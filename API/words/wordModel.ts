import mongoose, { Schema, model } from 'mongoose';
import { UserModel } from '../users/userModel';

export class Word {
    en_word: string;
    he_word: string;

    constructor({en_word, he_word}: {en_word: string, he_word: string}){
        this.en_word = en_word;
        this.he_word = he_word;
    }
}

//deine a schema
export const WordSchema = new Schema({
    en_word: {
        type: String,
        required: true,
    },
    he_word: {
        type: String,
        required: true,
    },
  });

// Create a unique compound index for en_word, he_word
WordSchema.index({ en_word: 1, he_word: 1}, { unique: true });

export const WordModel = model("word", WordSchema)

export const words: Word[] = [];

const UserWordsSchema = new mongoose.Schema({
    wordsId: {type: Schema.Types.ObjectId, ref: WordModel},
    userId: {type: Schema.Types.ObjectId, ref: UserModel},
});

// Create a unique compound index for UserWordsSchema
UserWordsSchema.index({ wordsId: 1, userId: 1}, { unique: true });

export const UserWordsModel = mongoose.model("userwords", UserWordsSchema);