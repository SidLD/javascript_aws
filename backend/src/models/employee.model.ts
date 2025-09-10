import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
  photo?: string | null;
  name: string;
  username: string;
  country: string;
  email: string;
  accountType: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema<IEmployee> = new Schema(
  {
    photo: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    country: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    accountType: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Employee: Model<IEmployee> = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;

