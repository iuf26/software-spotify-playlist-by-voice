import express from "express";
import { validateTokenMiddleware } from "server/helpers/jwt.helper";
import * as userController from "server/controllers/user.controller";
import path from "path";

const router = express.Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/logout", validateTokenMiddleware, userController.logout);
router.get("/verify/:userId/:otp", userController.verify);
router.get("/verified", (req, res) => {
  res.render(path.join(__dirname, "../../views/verified.pug"), {
    redirectPage: `${process.env.LOGIN_PAGE_HOST}`,
  });
});
router.get(
  "/password-reset/:email/:otp",
  userController.checkResetPasswordLink
);
router.get(
  "/password-reset/verify-link/:email/:otp",
  userController.checkResetPasswordOtp
);
router.get("/password-reset", userController.resetPassword);
router.post(
  "/password-reset/new-credentials",
  userController.updateCredentials
);
export { router as userRoute };
