import mongoose, { model, Schema, Types } from "mongoose";

interface IUser {
  email: string;
  username: string;
  password: string;
  name: string;
  location?: string;
  socialOnly: boolean;
  avatarUrl?: string;
  comments: Types.ObjectId[];
  videos: Types.ObjectId[];
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
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CommentModel",
    },
  ],
  videos: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "VideoModel" },
  ],
});

const UserModel = model("UserModel", schema);

export default UserModel;
