import { DateTime } from "luxon";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const userSchema = new Schema({
  email: {
    type: String,
    required: "Enter email",
  },
  password: {
    type: String,
    required: "Enter password",
  },
  permissions: {
    type: Object,
    default: ["user"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: String,
    default: DateTime.utc().toISO(),
  },
  acces_token: {
    type: String,
    default: null,
  },
  spotify_verified: {
    type: Boolean,
    default: false,
  },
  spotify_acces_token: {
    type: String,
    default: null,
  },
  spotify_refresh_token: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
