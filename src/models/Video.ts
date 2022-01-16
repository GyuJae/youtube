import mongoose, { Date, model, Schema } from "mongoose";

// interface IHashtag {
//   type: string;
// }

interface IMeta {
  views: number;
  rating: number;
}

interface IVideo {
  title: string;
  description: string;
  createdAt: Date;
  hashtags: string[];
  meta: IMeta;
}

const schema = new Schema<IVideo>({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, minlength: 20 },
  createdAt: { type: Date, default: Date.now() },
  hashtags: [{ type: String }],
  meta: {
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
});

const VideoModel = model<IVideo>("Video", schema);

export default VideoModel;
