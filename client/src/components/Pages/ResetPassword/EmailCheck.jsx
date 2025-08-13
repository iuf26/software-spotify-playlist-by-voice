import { useCallback, useEffect, useState } from "react";
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
  requestResetPassword,
  requestResetPasswordOtpVerify,
} from "helpers/account";
import { mapResponse, mapError } from "helpers/mappings";
import { useSnackbar } from "notistack";

export const EmailCheck = () => {
  const [email, setEmail] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const emailChanged = (e) => {
    setEmail(e.target.value);
  };

  const onContinueButtonClick = useCallback(() => {
    requestResetPassword({ email })
      .then((res) => mapResponse(res))
      .then((res) => {
        enqueueSnackbar("Reset password email sent", { variant: res.severity });
      })
      .catch((error) => {
        error = mapError(error);
        enqueueSnackbar(error.message, { variant: error.severity });
      });
  }, [email, enqueueSnackbar]);

  return (
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={emailChanged}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={onContinueButtonClick}
                >
                  Continue
                </Button>
              </>
            </Box>
          </StyledBoxContainer>
        </Grid>
      </StyledGridContainer>
    </>
  );
};
