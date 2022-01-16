import mongoose, { model, Schema } from "mongoose";

interface IUser {
  email: string;
  username: string;
  password: string;
  name: string;
  location?: string;
}

const schema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

const UserModel = model("User", schema);

export default UserModel;
