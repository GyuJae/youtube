import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/youtube", {});

const db = mongoose.connection;

db.on("error", (error): void => {
  console.error(`❌ DB Error occured: ${error}`);
});
db.once("open", (): void => {
  console.log(`✅ connected Mongo DB`);
});
