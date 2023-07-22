import jwt from "jsonwebtoken";
import { UnAuthenticatedError, ForbiddenError } from "./errors.js";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) throw new UnAuthenticatedError("Unauthorized request");

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      throw new ForbiddenError("User is not allowed to make this request");

    req.userId = decoded.userId;
    next();
  });
};

export default verifyJWT;
