import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "assets/styles/style.css";
import { AppContextProvider } from "components/AppContext";
import { SnackbarProvider } from "notistack";
import { store } from "redux/store";
import "semantic-ui-css/semantic.min.css";

import App from "./App";
import "./helpers/host.js";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider
        maxSnack={1}
        style={{ width: "20rem" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
