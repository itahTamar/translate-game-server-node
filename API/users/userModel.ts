import { Document, Model, Schema, model } from 'mongoose';
import mongoose from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  userName: string;
  password: string;
  highScore: number;
  role: string;
  email: string;
}
export class User {
  userName: string;
  password: string;
  highScore: number;
  role: string;
  id: string;
  email: string;

  constructor({ userName, password}: { userName: string, password: string }) {
    this.userName = userName;
    this.password = password;
    this.role = "user";
    this.highScore = 0;
    this.email = "none"
  }

  setRole(role: string) {
    this.role = role;
  }
}

//define a schema (It is like interface in typescript)
export const userSchema = new mongoose.Schema<IUser>({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  highScore: { type: Number, default: 0 }, // Add the new field with a default value
  role: {type: String, default: "user"},
  email: {type: String, default: "none", unique: true}
});

// Create the UserModel and extend it with custom methods
export interface IUserModel extends Model<IUser> {
  findOneAndUpdateDataOnMongoDB(filter: Record<string, any>, update: Record<string, any>): Promise<any>;
}

export const UserModel = model<IUser, IUserModel>("users", userSchema)

export const users: User[] = [];

//"users" is the name of the collection in the DB