import mongoose, { model, Schema } from "mongoose";

interface IUser {
  email: string;
  username: string;
  password: string;
  name: string;
  location?: string;
  socialOnly: boolean;
  avatarUrl?: string;
}

const schema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  avatarUrl: String,
});

const UserModel = model("User", schema);

export default UserModel;
