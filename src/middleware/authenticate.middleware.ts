import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { RequestWithUser } from "../utils/requestWithUser";
import { jwtPayload } from "../utils/jwtPayload.type";
import { HttpException } from "../exception/http.exception";

export const authenticate = async (
  req: RequestWithUser,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = getTokenFromRequestHeader(req);
    const payload: jwtPayload = jsonwebtoken.verify(
      token,
      "ABCDE"
    ) as jwtPayload;
    req.name = payload.name;
    req.email = payload.email;
    req.role = payload.role;
    next();
  } catch (error) {
    next(new HttpException(401, error.message)); //this next will handle the case when token is missing or invalid in request auth header
  }
};

const getTokenFromRequestHeader = (req: express.Request) => {
  const bearerToken = req.header("Authorization");
  const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
  return token;
};
