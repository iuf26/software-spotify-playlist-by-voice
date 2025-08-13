import jwt from "jsonwebtoken";
import User from "server/models/User";

const options = {
  expiresIn: "24h",
};

export const generateJwt = (username,spotifyToken='') => {
  try {
    const payload = { username,spotifyToken };
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
  } catch (error) {
    return null;
  }
};

export const validateTokenMiddleware = async (req, res, next) => {
  //un proxy
  const token = req.cookies.token;
  let result;

  if (!token) {
    return res.status(401).json({
      message: "Access token is missing",
    });
  }

  try {
    let user = await User.findOne({
      access_token: token,
    });

    if (!user) {
      return res.status(403).json({
        message: "Authorization error",
      });
    }

    result = jwt.verify(token, process.env.JWT_SECRET, options);

    if (!user.email === result.username) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    res.locals.decodedJwt = result;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        message: "Token expired",
      });
    }

    return res.status(403).json({
      message: "Authentication error",
    });
  }
};


