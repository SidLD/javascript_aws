import { Request, Response } from 'express';
import Employee, { IEmployee } from '../models/employee.model';
import multer from 'multer';

const upload = multer();

export const createEmployee = async (req: Request, res: Response) => {
  try {
    upload.single('file')(req as any, res as any, async (err: any) => {
      try {
        if (err) {
          return res.status(400).json({ message: 'Error parsing file', error: err.message || err })
        }

        const payload = req.body.payload ? JSON.parse(req.body.payload) : req.body

        if (!payload.name || !payload.username || !payload.email) {
          return res.status(400).json({ message: 'Name, username, and email are required' })
        }

        const newEmployee = new Employee({
          name: payload.name,
          username: payload.username,
          email: payload.email,
          country: payload.country,
          accountType: payload.accountType,
          photo: req.file ? `/uploads/${req.file.originalname}` : payload.photo || null,
        })

        const savedEmployee = await newEmployee.save()
        res.status(201).json(savedEmployee)
      } catch (innerErr: any) {
        console.error('Error creating employee:', innerErr)
        res.status(500).json({ message: 'Error creating employee', error: innerErr.message || innerErr })
      }
    })
  } catch (outerErr: any) {
    console.error('Unexpected error in createEmployee:', outerErr)
    res.status(500).json({ message: 'Unexpected server error', error: outerErr.message || outerErr })
  }
}

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const employees = await Employee.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments();

    res.status(200).json({
      data: employees,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err });
  }
};

// READ Single Employee
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee', error: err });
  }
};

// UPDATE Employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.employeeId,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', error: err });
  }
};

// DELETE Employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.employeeId);
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee', error: err });
  }
};
