import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const UserOtpVerificationSchema = new Schema({
  user_id: String,
  otp: String, //otp-one time password
  created_at: String,
  expires_at: String,
});

const UserOtpVerification = mongoose.model(
  "user_otp_verification",
  UserOtpVerificationSchema
);

export default UserOtpVerification;
