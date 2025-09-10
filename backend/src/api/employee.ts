import express from 'express';
import dotenv from 'dotenv';
import { verifyToken } from '../utils/verify';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller';

dotenv.config();

const employeeAPI = express();

// CRUD Endpoints
employeeAPI.post('/', verifyToken, createEmployee);
employeeAPI.get('/', verifyToken, getEmployees);
employeeAPI.put('/:employeeId', verifyToken, updateEmployee);
employeeAPI.delete('/:employeeId', verifyToken, deleteEmployee);

export default employeeAPI;
