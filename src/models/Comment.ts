import mongoose, { Date, Document, model, Schema, Types } from "mongoose";

interface IComment extends Document {
  payload: string;
  ownerId: Types.ObjectId;
  videoId: Types.ObjectId;
  createdAt: Date;
}

const schema = new Schema<IComment>({
  payload: { type: String, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UserModel",
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "VideoModel",
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

const CommentModel = model("CommentModel", schema);

export default CommentModel;
