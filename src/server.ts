import "reflect-metadata";
import { app } from "./app.js";
import dotenv from "dotenv";
import { myDataSource } from "./data-source.js";

dotenv.config();
const PORT = process.env.SERVER_PORT || 3001;

async function startServer() {
  try {
    await myDataSource.initialize();

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Server starting failed:", err);
    process.exit(1);
  }
}

startServer();
