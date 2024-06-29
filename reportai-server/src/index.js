import express from "express";
import * as database from "../database.js";
import cors from "cors";

import dotenv from "dotenv-safe";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Up!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log(`listening on port 8080!`);
});
