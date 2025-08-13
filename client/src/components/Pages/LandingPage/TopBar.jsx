import React from "react";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Logo from "assets/images/logo-listen-up-transparent.png";
import { requestLogout } from "helpers/account";
import { colorPurpleElectric, colorSpotifyGreen } from "assets/styles/colors";
import { Icon } from '@iconify/react';
import AccountMenu from "./AccountMenu";

export const TopBar = () => {
  return (
    <AppBar
      position="fixed"
      color="secondary"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height:'7rem' ,boxShadow:`0px 0px 15px 0px ${colorPurpleElectric}`}}
    
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between",marginLeft:'-1.5rem' }}>
        <Typography variant="h6" noWrap component="div">
          <img
            src={Logo}
            alt="Listen up logo"
            style={{ width: "13rem", margin: 0 }}
          />
        </Typography>
        <div>
          <AccountMenu/>
        </div>
      </Toolbar>
    </AppBar>
  );
};
