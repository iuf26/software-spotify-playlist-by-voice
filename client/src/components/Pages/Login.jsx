import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { StyledBoxLogoContainerLeft } from "assets/styles/styledComponents";
import {
  StyledContainerImage,
  StyledBoxContainer,
  StyledGridContainer,
} from "assets/styles/styledComponents";
import { requestLogin } from "helpers/account";
import { mapError, mapResponse } from "helpers/mappings";
import { useSnackbar } from "notistack";
import { useAccount } from "redux/hooks/useAccount";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useAccount();

  const signIn = useCallback(() => {
    requestLogin({ email, password })
      .then((res) => mapResponse(res))
      .then((res) => {
        enqueueSnackbar(res.message, { variant: "success" });
        //TO DO: save in local storage a boolean value isAuthenticated
        login(email);
        navigate("/home");
      })
      .catch((error) => {
        error = mapError(error);
        enqueueSnackbar(error.message, { variant: "error" });
      });
  }, [password, email, enqueueSnackbar, navigate, login]);

  const emailChanged = (e) => {
    setEmail(e.target.value);
  };

  const passwordChanged = (e) => {
    setPassword(e.target.value);
  };

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
              Sign in
            </Typography>
            <Box component="form" noValidatesx={{ mt: 1 }}>
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={passwordChanged}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={signIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/account/reset/password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/account/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </StyledBoxContainer>
        </Grid>
      </StyledGridContainer>
    </>
  );
};
