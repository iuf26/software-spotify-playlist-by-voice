export const WARNING = "warning";
export const ERROR = "error";
export const INFO = "info";
export const SUCCESS = "success";

export const sendResponse = (response, status, message, severity, body) => {
  return response.status(status).json({ message, severity, body });
};
