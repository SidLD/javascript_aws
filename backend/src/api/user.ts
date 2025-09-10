import express from 'express';
import dotenv from 'dotenv';
import { verifyToken } from '../utils/verify';
import {
  login,
  registerUser,
  deleteUser
} from '../controllers/user.controller';

dotenv.config();

const userAPI = express();

userAPI.post('/login', login);
userAPI.post('/register', registerUser);
userAPI.delete('/:userId', verifyToken, deleteUser);

export default userAPI;