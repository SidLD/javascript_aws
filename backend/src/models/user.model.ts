import {  Schema, model } from 'mongoose'
import bcrypt from 'bcrypt';
import { IFile } from './file.model';

export type UserType = {
  matchPassword(arg0: string): unknown;
  _id?: string
  username: string
  email: string
  password?: string
}

export interface IUserDoc extends UserType, Document {
  matchPassword: (pass: string) => Promise<boolean>
}

const userSchema = new Schema<IUserDoc>(
  {
    username:               { type: String, required: true },
    email:                  { type: String, required: true, unique: true },
    password:               { type: String, required: false },
    
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compareSync(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password as string, 10 )
})

const User = model('User', userSchema)
export default User