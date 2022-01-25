import mongoose, { Date, model, Schema, Types } from "mongoose";

// interface IHashtag {
//   type: string;
// }

interface IMeta {
  views: number;
}

interface IVideo {
  title: string;
  description: string;
  thumbnail: string;
  createdAt: Date;
  hashtags: string[];
  meta: IMeta;
  fileUrl: string;
  owner: Types.ObjectId;
  comments: Types.ObjectId[];
}

const schema = new Schema<IVideo>({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  fileUrl: { type: String, required: true },
  thumbnail: { type: String, required: true },
  description: { type: String, trim: true, minlength: 20 },
  createdAt: { type: Date, default: Date.now() },
  hashtags: [{ type: String }],
  meta: {
    views: {
      type: Number,
      default: 0,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UserModel",
  },
});

const VideoModel = model<IVideo>("VideoModel", schema);

export default VideoModel;
