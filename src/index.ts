import "./db";
import "./models/Video";
import app from "./server";

const PORT = 3000;

try {
  app.listen(PORT, (): void => {
    console.log(`✅ Connected successfully on port http://localhost:${PORT}`);
  });
} catch (error) {
  console.error(`❌ Error occured: ${error} `);
}
