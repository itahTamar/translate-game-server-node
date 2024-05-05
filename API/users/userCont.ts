import { UserModel } from "./userModel";
import bcrypt from "bcrypt";
import jwt from 'jwt-simple';

const { JWT_SECRET } = process.env;
const secret = JWT_SECRET;


const saltRounds = 10;

//register user
export const registerUser = async (req: any, res: any) => {
  try {
    console.log("hello from server registerUser")

    const { userName, password } = req.body;
    console.log({userName}, {password} )
    if (!userName || !password) throw new Error("At userCont-registerUser complete all fields");
   
    //encode password with bcrypt.js
    const hash = await bcrypt.hash(password, saltRounds);

    const user = new UserModel({ userName, password: hash });
    const userDB = await user.save();
    console.log(userDB)
    if (userDB) {
    res.send({ ok: true });
    } else {
      res.send({ok: false})
    }
  } catch (error) {
    console.error(error);
    res.send({ error: error.message });
  }
} //work ok

//login user
export const login = async (req: any, res: any) => {
  try {
    const { userName, password } = req.body;
    console.log("At userCont login:", { userName, password })
    if (!userName || !password) throw new Error("At userCont login: complete all fields");
    //check if user exist and password is correct
    const userDB = await UserModel.findOne({ userName });

    if (!userDB) throw new Error("At userCont login: some of the details are incorrect");

    const { password: hash } = userDB;

    if (!hash) throw new Error("At userCont login: some of the details are incorrect");

    //check if hash password is equal to the password that the user entered
    const match:boolean = await bcrypt.compare(password, hash);
    if (!match) throw new Error("At userCont login: some of the details are incorrect");

    //create and encode cookie with JWT
    // encode
    const JWTCookie = jwt.encode(userDB._id, secret); //the id given by mongo is store in the cookie
    console.log("At userCont login JWTCookie:",JWTCookie) //got it here!

    res.cookie("user", JWTCookie, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }); //send the cookie to client
    res.send({ ok: true });
    
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: error.message });
  }
}//work ok

// export async function getUser(userID: string) {
//   try {
//       const secret = process.env.JWT_SECRET;
//       if (!secret) throw new Error("At userCont getUser: Couldn't load secret from .env"); 

//       console.log('At userCont getUser the parameter:', userID) //got it

//       const decodedUserId = jwt.decode(userID, secret); 
//       console.log('At userCont getUser the decodedUserId:', decodedUserId) 
      
//       // const { userId } = decodedUserId;

//       const userDB = await UserModel.findById(decodedUserId);
//       if (!userDB) throw new Error(`At userCont getUser: Couldn't find user id with the id: ${decodedUserId}`);
//       //console.log('At userCont getUser userDB:',userDB) //work
//       //res.send({ userDB });
//       return userDB.userName
//   } catch (error) {
//       //res.send({ error: error.message })
//       console.error(error);
//   }
// }


//did not use this functions now:
export async function deleteUser(req:any, res:any){
  try {
    const { userName, password } = req.body;
    if (!userName || !password) throw new Error("please fill all")
    
    //check if user exist and password is correct
    const userDB = await UserModel.findOne({ userName });
    if (!userDB) throw new Error("some of the details are incorrect");
    const { password: hash } = userDB;
    if (!hash) throw new Error("some of the details are incorrect");

    //check if hash password is equal to the password that the user entered
    const match:boolean = await bcrypt.compare(password, hash);
    if (!match) throw new Error("some of the details are incorrect");

    await UserModel.findOneAndDelete({userName, password})
    res.send({ ok: true });
  } catch (error) {
    console.error(error);
    res.send({ error: error.message });
  }
}

export async function updateUser(req:any, res:any){
  try {
    const { oldName, oldpassword, newname, newpassword } = req.body;
    if (!oldName || !oldpassword || !newname || !newpassword) throw new Error("please fill all")
    
    //check if user exist and password is correct
    const userDB = await UserModel.findOne({ oldName });
    if (!userDB) throw new Error("some of the details are incorrect");
    const { password: hash } = userDB;
    if (!hash) throw new Error("some of the details are incorrect");

    //check if hash password is equal to the password that the user entered
    const match:boolean = await bcrypt.compare(oldpassword, hash);
    if (!match) throw new Error("some of the details are incorrect");

    const newUserdb = await UserModel.findOneAndUpdate({ oldName, oldpassword}, {newname, newpassword})
    res.send({ ok: true }, newUserdb);
  } catch (error) {
    console.error(error);
    res.send({ error: error.message });
  }
}
