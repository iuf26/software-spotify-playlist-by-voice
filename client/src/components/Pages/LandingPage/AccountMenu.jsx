import * as React from "react";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Icon } from "@iconify/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Logout from "@mui/icons-material/Logout";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { colorSpotifyGreen } from "assets/styles/colors";
import { requestLogout } from "helpers/account";
import { mapResponse } from "helpers/mappings";
import { requestSpotifyLogin } from "helpers/streaming";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { useAccount } from "redux/hooks/useAccount";
import { selectUsername } from "redux/selectors/accountSelector";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { logout } = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const username = useSelector(selectUsername);
  const open = Boolean(anchorEl);

  const onLogoutClick = () => {
    logout();
    requestLogout();
    Cookies.remove("token");
    Cookies.remove("authenticated");
  };

  const onAddSpotifyClick = () => {
    requestSpotifyLogin(username)
      .then((res) => mapResponse(res))
      .then((res) => {
        window.location.replace(res.body.redirectLink);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "#2E2B2B",
          borderRadius: "20px",
        }}
      >
        <Tooltip title="Account settings">
          <Box
            sx={{
              display: "inline-flex",
              gap: "0.2rem",
              marginTop: "0.3rem",
              height: "2.5rem",
            }}
            onClick={handleClick}
          >
            <AccountCircleIcon
              sx={{
                ml: 2,
                width: 32,
                height: 32,
                margin: 0,
                padding: "0.2rem",
              }}
            />
            <p style={{ marginTop: "5px" }}>{username}</p>
            {/* TO DO: add  with redux logged in user  */}
            <ArrowDropDownIcon
              sx={{ ml: 2, width: 25, height: 25, margin: 0, marginTop: "3px" }}
            />
          </Box>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={onAddSpotifyClick} sx={{ margin: 0 }}>
          <ListItemIcon>
            <Icon
              icon="mdi:spotify"
              width="1.90rem"
              height="1.90rem"
              color={colorSpotifyGreen}
            />
          </ListItemIcon>
          Add Spotify
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogoutClick}>
          <ListItemIcon>
            <Logout sx={{ width: "1.70rem", height: "1.70rem" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
