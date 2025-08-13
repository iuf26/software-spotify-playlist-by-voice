import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PredictedEmotionDialog = () => {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const vertical = "bottom";
  const horizontal = "right";
  const action = (
    <>
      <Fab size="small" sx={{ backgroundColor: "#1DB954" }}>
        <PlayArrowIcon sx={{ mr: 1 }} />
      </Fab>
    </>
  );
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="Continue with a playlist recommandation?"
        key={vertical + horizontal}
        action={action}
        sx={{ backgroundColor: "orange" }}
      />
    </div>
  );
};
