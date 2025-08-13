import { ThemeProvider } from "@mui/material/styles";
import { theme } from "assets/styles/theme";
import Routing from "components/Routing";

import "./App.css";
import "assets/styles/voiceRecorder.css"
import "assets/styles/style.css"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routing />
    </ThemeProvider>
  );
}

export default App;
