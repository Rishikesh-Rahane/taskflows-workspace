import express, { Router } from 'express';  
import {  verifyJWT } from '../middlewares/authMiddleware';
import { getUsers } from '../controller/userCtrl';

const userRouter:Router = express.Router();

// Define user-related routes here
//jwt protected route to get all users
userRouter.get('/users',verifyJWT,getUsers);

export default userRouter;