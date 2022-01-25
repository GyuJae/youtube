import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

try {
  app.listen(PORT, (): void => {
    console.log(`✅ Connected successfully on port http://localhost:${PORT}`);
  });
} catch (error) {
  console.error(`❌ Error occured: ${error} `);
}
