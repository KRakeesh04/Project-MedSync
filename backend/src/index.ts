import express from "express";
import type { Express, Request, Response } from "express";
import { MapRouters } from "./router/router.js";
import cors from "cors";

const port = process.env.PORT || 8000;
const app: Express = express();
app.use(express.json());
app.use(cors());

MapRouters(app);

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
  console.log(`click to open: http://localhost:${port}`);
});
