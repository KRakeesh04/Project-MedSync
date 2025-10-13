import express from "express";
import type { Express, Request, Response } from "express";
import { MapRouters } from "./router/router.js";
import cors from "cors";

const port = process.env.PORT || 8000;
const app: Express = express();
app.use(express.json());
app.use(cors());

app.use((req,res,next) =>{
  res.header("Access-Control-Allow-Origin",'http://localhost:5173');
  res.header("Access-Control-Allow-Methods",'GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers",'content-Type,Authorization');
  
  if (req.method === 'OPTIONS'){
    res.sendStatus(200);
  }else{
    next();
  }
});
app.use(express.json())

MapRouters(app);

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
  console.log(`click to open: http://localhost:${port}`);
});
