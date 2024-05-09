import express from 'express'
import { registerUser, login, getUserHighScore  } from './userCont';
//import { isAdmin } from './middelware/users';
const router = express.Router();

router
    .post('/login',login)
    .post("/register", registerUser)
    .get("/getUserHighScore", getUserHighScore)
    //.get("/get-user", getUser)
    //.get("/get-users",isAdmin, getUsers)
   
export default router;