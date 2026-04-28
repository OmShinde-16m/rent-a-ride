import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(errorHandler(403, "bad request no header provided"));
  }

  const parts = req.headers.authorization.split(" ");
  if (parts.length < 2) {
    return next(errorHandler(403, "bad request invalid authorization header"));
  }

  const tokenParts = parts[1].split(",");
  const refreshTokenValue = tokenParts[0] || null;
  const accessTokenValue = tokenParts[1] || null;

  // Try access token first (preferred)
  if (accessTokenValue) {
    try {
      const decoded = jwt.verify(accessTokenValue, process.env.ACCESS_TOKEN);
      req.user = decoded.id;
      return next();
    } catch (error) {
      if (error.name !== "TokenExpiredError") {
        // Access token is invalid (not just expired) — reject
        return next(errorHandler(403, "Token is not valid"));
      }
      // Access token expired — fall through to try refresh token below
      console.log("Access token expired, trying refresh token...");
    }
  }

  // No valid access token — try refresh token
  if (!refreshTokenValue) {
    return next(errorHandler(401, "You are not authenticated"));
  }

  try {
    const decoded = jwt.verify(refreshTokenValue, process.env.REFRESH_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(errorHandler(403, "Invalid refresh token"));
    }

    if (user.refreshToken !== refreshTokenValue) {
      return next(errorHandler(403, "Invalid refresh token"));
    }

    // Refresh token is valid — authenticate the request
    // NOTE: We do NOT rotate tokens here. Token rotation should only happen
    // at a dedicated /refreshToken endpoint, not in middleware.
    // Rotating here causes the DB token to change while the client still
    // holds the old token, breaking all subsequent requests.
    req.user = decoded.id;
    next();
  } catch (error) {
    console.log("Refresh token verification error:", error.message);
    return next(errorHandler(403, "Invalid refresh token"));
  }
};
