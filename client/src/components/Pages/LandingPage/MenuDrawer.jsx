import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { colorPurple, colorPurpleElectric } from "assets/styles/colors";
import { Drawer, DrawerHeader } from "assets/styles/styledComponents";
import { drawerMenuOptions, routeMatchesText } from "helpers/menuDrawer";
import { selectRoute } from "redux/selectors/routeSelector";
import { RouteActions } from "redux/slices/routeSlice";

const drawerWidth = 210;

export function MenuDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [section, setSection] = useState("Home");
  const routeSelector = useSelector(selectRoute);
  const dispatch = useDispatch();

  const onMenuOptionClicked = (destination) => {
    switch (destination) {
      case "/home":
        dispatch(RouteActions.setRoute("/home"));
        break;
      case "/dj":
        dispatch(RouteActions.setRoute("/dj"));
        break;
      case "/kids-dj":
        dispatch(RouteActions.setRoute("/kids-dj"));
        break;
      default:
        break;
    }

    navigate(destination);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={true}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: "#0E0E0E ",
        },
      }}
    >
      <DrawerHeader>
        <IconButton>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ marginTop: "3rem" }}>
        {drawerMenuOptions.map(({ text, icon, route }, index) => (
          <ListItem
            key={text}
            disablePadding
            sx={{
              display: "block",

              "&:hover": {
                background: "#3C3C3C",
              },
            }}
            onClick={() => onMenuOptionClicked(route)}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{ opacity: 1, color: "white" }}
              />
              {
               routeMatchesText(text,routeSelector.route) && (
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    flexDirection: "flex-end",
                    color: "white",
                    marginRight: "10px",
                    marginLeft: 0,
                  }}
                >
                  <ChevronLeftIcon />
                </ListItemIcon>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
