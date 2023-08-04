import express from "express";
import jsonwebtoken from "jsonwebtoken";

export const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = getTokenFromRequestHeader(req);
    jsonwebtoken.verify(token, "ABCDE");
    next();
  } catch (error) {
    next(error);
  }
};

const getTokenFromRequestHeader = (req: express.Request) => {
  const bearerToken = req.header("Authorization");
  const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
  return token;
};
