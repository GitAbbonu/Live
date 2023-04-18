import express from "express";
import "express-async-errors";
import morgan from "morgan";
import {
  getAll,
  getByID,
  create,
  updateByID,
  deleteByID,
} from "./controllers/planets.js";

const server = express();
const port = 5000;

server.use(morgan("dev"));
server.use(express.json());

server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Pass to next layer of middleware
  next();
});

server.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome" });
});

server.get("/planets", getAll);

server.get("/planets/:id", getByID);

server.post("/planets", create);

server.put("/planets/:id", updateByID);

server.delete("/planets/:id", deleteByID);

server.listen(port);
