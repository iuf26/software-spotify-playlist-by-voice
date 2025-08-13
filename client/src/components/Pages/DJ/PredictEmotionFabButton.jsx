import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Grow } from "@mui/material";
import Fab from "@mui/material/Fab";
import { colorPurplePowder } from "assets/styles/colors";

export const PredictEmotionFabButton = (props) => {
  return (
    <Grow
      in={true}
      style={{ transformOrigin: "2 2 2" }}
      {...(true ? { timeout: 1000 } : {})}
    >
      <Fab
        size="large"
        variant="extended"
        sx={{ backgroundColor: colorPurplePowder }}
        {...props}
      >
        <PlayArrowIcon sx={{ mr: 1 }} />
        Predict my emotion
      </Fab>
    </Grow>
  );
};
