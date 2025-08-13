import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import mongoose, { mongo } from "mongoose";
import { generateJwt } from "server/helpers/jwt.helper";
import {
  sendResetPasswordLink,
  sendVerificationEmail,
} from "server/helpers/mail.helper";
import {
  ERROR,
  sendResponse,
  SUCCESS,
  WARNING,
} from "server/helpers/response.helper";
import User from "server/models/User";
import UserOtpVerification from "server/models/UserOtpVerification";

const comparePasswords = async (plaintextPassword, hash) => {
  return bcrypt.compare(plaintextPassword, hash);
};

export const register = (req, res) => {
  const { email, password, confirmation } = req.body;
  if (!email || !password || !confirmation) {
    return sendResponse(res, 400, "Fill empty fields", WARNING);
  }
  if (password !== confirmation) {
    return sendResponse(
      res,
      400,
      "Confirmation password doesn't match",
      WARNING
    );
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      return sendResponse(
        res,
        400,
        "A user with this email already exists!",
        WARNING
      );
    }
    const newUser = new User({
      email,
      password,
    });
    //Password Hashing
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((result) => {
            sendVerificationEmail(result, res);
          })
          .catch((err) =>
            //TO DO: send error message to the logging system so that it could be saved somewhere in a aws file
            sendResponse(res, 500, "Could not save user in database", ERROR)
          );
      })
    );
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, 400, "Please fill empty fields", WARNING);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(res, 400, "User does not exist!", WARNING);
  }
  if (!user.verified) {
    return sendResponse(res, 400, "Account is not verified!", ERROR);
  }
  const passwordComparisonResult = await comparePasswords(
    password,
    user.password
  );
  if (passwordComparisonResult) {
    const token = generateJwt(email);
    if (!token)
      //TO DO: send message to rabbitmq logging system(audit)  "Generate token failed for login!"
      return sendResponse(res, 500, "Login failed", ERROR);
    user.acces_token = token;
    await user.save();
    res.cookie("token", token, {
      path: "/",
      expires: DateTime.now().plus({ days: 2 }).toJSDate(),
    });
    res.cookie("authenticated", true, {
      path: "/",
      expires: DateTime.now().plus({ days: 2 }).toJSDate(),
    });
    return sendResponse(res, 200, "Successful login!", SUCCESS, { token });
  }
  return sendResponse(res, 400, "Wrong credentials!", ERROR);
};

export const logout = (req, res) => {
  const { username, spotifyToken } = res.locals.decodedJwt;
  User.findOne({ email: username })
    .then(async (user) => {
      if (user) {
        user.acces_token = null;
        await user.save();
        return sendResponse(res, 200, "User logged out!", SUCCESS);
      }
      return sendResponse(res, 500, "Could not find user to log out!", ERROR);
    })
    .catch((error) => {
      //TO DO send message to audit system (rabbit mq)
      return sendResponse(res, 500, error, ERROR);
    });
};

export const verify = (req, res) => {
  const { userId, otp } = req.params;
  UserOtpVerification.findOne({ user_id: userId })
    .then(async (result) => {
      if (!result) {
        return sendResponse(res, 404, "Invalid verification link!", ERROR);
      }

      const { user_id, expires_at, otp: otpHashed } = result;
      const otpValidationResult = await comparePasswords(otp, otpHashed);
      if (!otpValidationResult) {
        return sendResponse(res, 404, "Invalid verification link!", ERROR);
      }

      const currentTime = DateTime.utc();
      const expiresAt = DateTime.fromISO(expires_at).toUTC();
      if (currentTime <= expiresAt) {
        await User.findOneAndUpdate(
          { email: user_id },
          { $set: { verified: true } }
        );
        await UserOtpVerification.deleteOne({ user_id, otp: otpHashed });
        //return sendResponse(res, 200, "Successfully verified email!", SUCCESS);
        return res.redirect("/user/verified");
      }

      await UserOtpVerification.deleteOne({ user_id, otp: otpHashed });
      return sendResponse(
        res,
        410,
        "Link for email verification expired!",
        ERROR
      );
    })
    .catch((error) => {
      //TO DO send error to audit service
      return sendResponse(res, 500, "Email verification failed!", ERROR);
    });
};

export const resetPassword = async (req, res) => {
  const { email } = req.query;

  //clean past otp
  try {
    await UserOtpVerification.deleteMany({ user_id: email });
  } catch (error) {
    return sendResponse(res, 500, "Internal server error", ERROR);
  }

  if (!email) return sendResponse(res, 400, "Invalid email", ERROR);
  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(res, 400, "Coldn't validate email!", ERROR);
  }
  sendResetPasswordLink({ email }, res);
};

export const checkResetPasswordOtp = (req, res) => {
  const { email, otp } = req.params;
  UserOtpVerification.findOne({ user_id: email })
    .then(async (result) => {
      const { user_id, otp: otpHashed } = result;

      const otpValidationResult = await comparePasswords(otp, otpHashed);
      if (!otpValidationResult) {
        return sendResponse(res, 404, "Not authorized!", ERROR);
      }
      await UserOtpVerification.deleteOne({ user_id, otp: otpHashed });
      return sendResponse(res, 200, "Authorized to reset password!", SUCCESS);
    })
    .catch((error) =>
      //TO DO log error rabbitmq
      sendResponse(res, 404, "Could not authorize password reset!", ERROR)
    );
};

export const checkResetPasswordLink = (req, res) => {
  const { email, otp } = req.params;
  UserOtpVerification.findOne({ user_id: email })
    .then(async (result) => {
      if (!result) {
        return sendResponse(res, 404, "Invalid link!", ERROR);
      }

      const { user_id, expires_at, otp: otpHashed } = result;
      const otpValidationResult = await comparePasswords(otp, otpHashed);
      if (!otpValidationResult) {
        return sendResponse(res, 404, "Invalid link!", ERROR);
      }

      const currentTime = DateTime.utc();
      const expiresAt = DateTime.fromISO(expires_at).toUTC();
      if (currentTime <= expiresAt) {
        await User.findOneAndUpdate(
          { email: user_id },
          { $set: { verified: true } }
        );
        // await UserOtpVerification.deleteOne({ user_id, otp: otpHashed });
        return res.redirect(
          `${process.env.RESET_PASSWORD_PAGE_HOST}/${email}/${otp}`
        );
      }

      await UserOtpVerification.deleteOne({ user_id, otp: otpHashed });
      return sendResponse(res, 410, "Link for password reset expired!", ERROR);
    })
    .catch((error) => {
      //TO DO send error to audit service
      return sendResponse(res, 500, "Reset password failed!", ERROR);
    });
};

export const updateCredentials = async (req, res) => {
  const { email, password, confirmation } = req.body;

  if (!password || !confirmation) {
    return sendResponse(res, 400, "Fill empty fields", WARNING);
  }

  if (password !== confirmation) {
    return sendResponse(
      res,
      400,
      "Confirmation password doesn't match",
      WARNING
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(res, 400, "User does not exist!", WARNING);
  }

  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) throw err;
      try {
        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              password: hash,
            },
          }
        );
        sendResponse(res, 200, "Password updated!", SUCCESS);
      } catch (error) {
        sendResponse(res, 500, "Could not update password", ERROR);
      }
    })
  );
};
