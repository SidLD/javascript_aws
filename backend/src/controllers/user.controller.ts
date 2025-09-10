import jwt from 'jsonwebtoken';
import CONFIG from '../config/vars';
import type { UserType, IUserDoc } from '../models/user.model';
import { uploadFile } from '../services/bucket';
import User from '../models/user.model';

// GET USERS
export const getUsers = async (req:any, res:any) => {
  try {
    const { start = 0, limit = 10, search = '', sort = 'createdAt' }: any = req.query;
    const startNumber = parseInt(start, 10);
    const limitNumber = parseInt(limit, 10);
    const searchCriteria = search
      ? { username: search, role: 'USER' }
      : { role: 'USER' };

    const sortCriteria: Record<string, 1 | -1> = {};
    if (typeof sort === 'string') {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortCriteria[sortField] = sortOrder;
    }

    const users = await User.find(searchCriteria)
      .sort(sortCriteria)
      .skip(startNumber)
      .limit(limitNumber)
      .select('-password')
      .populate('file')

    const totalUsers = await User.countDocuments(searchCriteria);

    return res.json({ users, total: totalUsers, start: startNumber, limit: limitNumber });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// REGISTER USER
export const registerUser = async (req:any, res:any) => {
  try {
    const body = req.body;

    const formData: Partial<UserType> = {
      ...body,
      role: body.role ?? 'USER',
    };

    if (!formData.email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: formData.email },
        { username: formData.username },
      ],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or Username already in use.' });
    }

    let fileId = null;
    if (req.files?.file) {
      fileId = await uploadFile(req.files.file as any, `${formData.username}-${new Date()}`);
    }

    const newUser = await User.create({
      username: formData.username,
      email: formData.email,
      password: formData.password || 'password'
    });

    const payload = {
      id: newUser._id,
      username: newUser.username,
    };

    const token = jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: '12h' });

    return res.json({
      success: true,
      data: { user: newUser, password: undefined },
      token,
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req:any, res:any) => {
  try {
    const params: IUserDoc = req.body;
    const findBy: any = { username: params.username };
    const user = await User.findOne(findBy);

    if (user) {
      const isMatch = await user.matchPassword(params.password as string);
      if (isMatch) {
        const payload = {
          id: user._id,
          username: user.username,
        };

        const token = jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: '12h' });

        return res.json({
          success: true,
          token,
          message: 'Login successful',
        });
      }
    }

    return res.status(400).json({ message: 'Incorrect Email or Password' });
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
};


// DELETE USER
export const deleteUser = async (req:any, res:any) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.deleteOne({ _id: userId });
    return res.json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};
