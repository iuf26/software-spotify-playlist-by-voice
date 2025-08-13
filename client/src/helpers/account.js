import axios from "axios";
import Cookies from "js-cookie";

const SERVER_HOST = process.env.REACT_APP_SERVER;
const SIGNUP = `${SERVER_HOST}/user/register`;
const LOGIN = `${SERVER_HOST}/user/login`;
const LOGOUT = `${SERVER_HOST}/user/logout`;
const RESET_PASSWORD_RESET_LINK_EMAIL = `${SERVER_HOST}/user/password-reset`;
const RESET_PASSWORD = `${SERVER_HOST}/user/password-reset/new-credentials`;
const RESET_PASSWORD_OTP_VERIFY = `${SERVER_HOST}/user/password-reset/verify-link`;
const options = {
  expiresIn: "24h",
};

export const requestSignup = ({ email, password, confirmation }) => {
  const body = { email, password, confirmation };
  return axios.post(SIGNUP, body);
};

export const requestLogin = ({ email, password }) => {
  const body = { email, password };
  return axios.post(LOGIN, body, { withCredentials: true });
};

export const requestResetPassword = ({ email }) => {
  return axios.get(`${RESET_PASSWORD_RESET_LINK_EMAIL}?email=${email}`);
};

export const requestPasswordUpdate = ({ email, password, confirmation }) => {
  //if (password !== confirmation) throw new Error
  const body = { email, password, confirmation };
  return axios.post(RESET_PASSWORD, body);
};

export const requestResetPasswordOtpVerify = ({ email, otp }) => {
  return axios.get(`${RESET_PASSWORD_OTP_VERIFY}/${email}/${otp}`);
};

export const requestLogout = () => {
  return axios.get(LOGOUT, { withCredentials: true });
};

export const extractDataFromToken = () => {
  const token = Cookies.get("token");
  
};
