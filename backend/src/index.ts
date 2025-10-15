import express from "express";
import type { Express } from "express";
import { MapRouters } from "./router/router.js";
import cors from "cors";
import { verifyDatabaseConnection } from "./db/db.js";

const port = process.env.PORT || 8000;
const app: Express = express();
app.use(express.json());
app.use(cors());

MapRouters(app);

// Verify database connection before starting server
(async () => {
  const dbConnected = await verifyDatabaseConnection();
  
  if (!dbConnected) {
    console.error('Failed to establish database connection. Exiting...');
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`now listening on port ${port}`);
    console.log(`click to open: http://localhost:${port}`);
  });
})();
