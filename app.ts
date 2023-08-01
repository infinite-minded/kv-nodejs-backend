import express from "express";

const server = express();

server.get("/", (req, res) => {
  console.log(req.url);
  res.status(200).send("Hello there!");
});

server.get("/*", (req, res) => {
  console.log(req.url);
  let str = "Hello this is " + req.url;
  res.status(200).send(str);
});

server.listen(3000, () => {
  console.log("Server is listening to port 3000");
});