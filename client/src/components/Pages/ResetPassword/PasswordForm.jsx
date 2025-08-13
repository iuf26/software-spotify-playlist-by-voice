import { useCallback, useEffect, useState, useRef } from "react";
import { Navigate, useSearchParams, redirect } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { TextField, Typography, Avatar, Button } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { StyledBoxLogoContainerLeft } from "assets/styles/styledComponents";
import {
  StyledContainerImage,
  StyledBoxContainer,
  StyledGridContainer,
} from "assets/styles/styledComponents";
import {
  requestPasswordUpdate,
  requestResetPassword,
  requestResetPasswordOtpVerify,
} from "helpers/account";
import { mapResponse, mapError } from "helpers/mappings";
import { useSnackbar } from "notistack";

import { EmailCheck } from "./EmailCheck";

export const PasswordForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [confirmation, setConfirmation] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { email, otp } = useParams();
  const [allowedRouteAcces, setAllowedRouteAcces] = useState(false);
  const dataFetchedRef = useRef(false);

  const checkAIfOtpValid = useCallback(() => {
    if (email && otp && !allowedRouteAcces) {
      requestResetPasswordOtpVerify({ email, otp })
        .then((res) => {
          if (res.status === 200) {
            setAllowedRouteAcces(true);
          }
        })
        .catch((error) => {
          navigate("/account/login");
        });
    }
  }, [email, otp, allowedRouteAcces,navigate]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    checkAIfOtpValid();
  }, [checkAIfOtpValid]);

  const passwordChanged = (e) => {
    setPassword(e.target.value);
  };

  const confirmationChanged = (e) => {
    setConfirmation(e.target.value);
  };

  const onResetPasswordButtonClick = useCallback(() => {
    requestPasswordUpdate({ email, password, confirmation })
      .then((res) => mapResponse(res))
      .then((res) => {
        enqueueSnackbar(res.message, { variant: res.severity });
        setTimeout(
          () =>
            enqueueSnackbar("You are redirected to login page...", {
              variant: "info",
            }),
          500
        );
        setTimeout(() => {
          navigate("/account/login");
        }, 3000);
      })
      .catch((error) => {
        error = mapError(error);
        enqueueSnackbar(error.message, { variant: error.severity });
      });
  }, [email, confirmation, password, enqueueSnackbar, navigate]);

  return allowedRouteAcces ? (
    <>
      <StyledBoxLogoContainerLeft />
      <StyledGridContainer>
        <CssBaseline />
        <StyledContainerImage />
        <Grid item md={4}>
          <StyledBoxContainer>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Box component="form" noValidatesx={{ mt: 1 }}>
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={passwordChanged}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirm"
                  label="Password confirmation"
                  type="password"
                  id="passwordConfirm"
                  onChange={confirmationChanged}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={onResetPasswordButtonClick}
                >
                  Reset password
                </Button>
              </>
            </Box>
          </StyledBoxContainer>
        </Grid>
      </StyledGridContainer>
    </>
  ) : (
    <EmailCheck />
  );
};
