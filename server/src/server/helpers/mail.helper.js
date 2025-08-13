import nodemailer from "nodemailer";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import UserOtpVerification from "server/models/UserOtpVerification";
import { renderFile } from "pug";
import path from "path";
import { ERROR, sendResponse, SUCCESS } from "./response.helper";

export const sendVerificationEmail = ({ _id, email }, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  const serverRootUrl = `${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}`;
  const otp = v4() + _id;
  const confirmationLink = `${serverRootUrl}/user/verify/${email}/${otp}`;
  const html = renderFile(path.join(__dirname, "../../views/mail.pug"), {
    confirmationLink,
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Welcome to our community of music enthusiasts!",
    html: html,
  };

  //hash otp - one time password
  const salt = 10;
  bcrypt
    .hash(otp, salt)
    .then((hashedOtp) => {
      const userOtpVerification = new UserOtpVerification({
        user_id: email,
        otp: hashedOtp,
        created_at: DateTime.utc().toISO(),
        expires_at: DateTime.utc().plus({ days: 1 }).toISO(),
      });

      userOtpVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              //TO DO: message for logging system Verification email sent and verification otp record saved!
              sendResponse(res, 200, "Verification email sent!", SUCCESS);
            })
            .catch((error) => {
              sendResponse(res, 500, "Email verification failed", ERROR);
            });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Couldn't save verification email data!" });
        });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "Error occurred while hashing email data!" });
    });
};

const saveOtpAndSendEmail = ({ otp, mailOptions, res }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  //hash otp - one time password
  const salt = 10;
  bcrypt
    .hash(otp, salt)
    .then((hashedOtp) => {
      const userOtpVerification = new UserOtpVerification({
        user_id: email,
        otp: hashedOtp,
        created_at: DateTime.utc().toISO(),
        expires_at: DateTime.utc().plus({ days: 1 }).toISO(),
      });

      userOtpVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              //Email sent and one time password record saved! - TO DO for rabbit mq logging system
              sendResponse(res, 200, "Email sent!", SUCCESS);
            })
            .catch((error) => {
              sendResponse(res, 500, "Failed to send email", ERROR);
            });
        })
        .catch((error) => {
          //to do: for logging system: Couldn't save email one time password!
          sendResponse(
            res,
            500,
            "Couldn't save email one time password!",
            ERROR
          );
        });
    })
    .catch(() => {
      //to do: for logging system: Error occurred while hashing one time password!
      sendResponse(
        res,
        500,
        " Error occurred while hashing one time password",
        ERROR
      );
    });
};

export const sendResetPasswordLink = ({ email }, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  const otp = v4();
  const confirmationLink = `${process.env.SERVER_ROOT}/user/password-reset/${email}/${otp}`;
  const html = renderFile(
    path.join(__dirname, "../../views/password-reset.pug"),
    {
      confirmationLink,
    }
  );

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Reset your account password",
    html: html,
  };

  //saveOtpAndSendEmail({ otp, mailOptions, res });
  const salt = 10;
  bcrypt
    .hash(otp, salt)
    .then((hashedOtp) => {
      const userOtpVerification = new UserOtpVerification({
        user_id: email,
        otp: hashedOtp,
        created_at: DateTime.utc().toISO(),
        expires_at: DateTime.utc().plus({ days: 1 }).toISO(),
      });

      userOtpVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              //Email sent and one time password record saved! - TO DO for rabbit mq logging system
              sendResponse(res, 200, "Email sent!", SUCCESS);
            })
            .catch((error) => {
              sendResponse(res, 500, "Failed to send email", ERROR);
            });
        })
        .catch((error) => {
          //to do: for logging system: Couldn't save email one time password!
          sendResponse(
            res,
            500,
            "Couldn't save email one time password!",
            ERROR
          );
        });
    })
    .catch(() => {
      //to do: for logging system: Error occurred while hashing one time password!
      sendResponse(
        res,
        500,
        " Error occurred while hashing one time password",
        ERROR
      );
    });
};
