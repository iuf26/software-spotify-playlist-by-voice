import React from "react";

import { Box } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import { styled, useTheme } from "@mui/material/styles";
import GirlImage from "assets/images/girl.jpg";
import Logo from "assets/images/logo-listen-up-transparent.png";
import { colorSmokeWhite } from "assets/styles/colors";

//Drawer
const drawerWidth = 240;

export const StyledContainerImage = ({ children }) => {
  return (
    <Grid
      item
      sm={6}
      md={8}
      sx={{
        backgroundImage: `url(${GirlImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "50% 0",
      }}
    >
      {children}
    </Grid>
  );
};

export const StyledBoxContainer = ({ children }) => (
  <Box
    sx={{
      my: 8,
      mx: 5,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    {children}
  </Box>
);

export const StyledGridContainer = ({ children }) => (
  <Grid
    container
    component="main"
    sx={{ height: "100vh", backgroundColor: colorSmokeWhite }}
  >
    {children}
  </Grid>
);

export const StyledBoxLogoContainerLeft = styled(Box)({
  height: "156px",
  width: "250px",
  backgroundImage: `url(${Logo})`,
  backgroundRepeat: "no-repeat",
  position: "absolute",
});

export const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

export const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
