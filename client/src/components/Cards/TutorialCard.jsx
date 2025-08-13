import * as React from "react";

import { CardActionArea, makeStyles } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

// const useStyles = makeStyles({
//   root: {
//     maxWidth: 310,
//     transition: "transform 0.15s ease-in-out",
//   },
//   cardHovered: {
//     transform: "scale3d(1.05, 1.05, 1)",
//   },
// });

export const TutorialCard = ({ imageSrc, text, title }) => {
  return (
    <CardActionArea sx={{'width':'20rem'}}>
      <Card
        sx={{
          maxWidth: 278,
          height: "35rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardMedia component="picture" height="1rem">
          <img src={require(`assets/images/${imageSrc}`)} alt="logo" />
        </CardMedia>
        <CardContent style={{}}>
          <Typography gutterBottom variant="h5" component="div">
            <strong>{title}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};
