import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import { Home } from "components/Pages/LandingPage/Home";
import { Login } from "components/Pages/Login";
import { EmailCheck } from "components/Pages/ResetPassword/EmailCheck";
import { PasswordForm } from "components/Pages/ResetPassword/PasswordForm";
import { Signup } from "components/Pages/Signup";
import { ProtectedRoute } from "components/ProtectedRoute";
import { Recorder } from "components/RecordingFunctionality/components/Recorder";
import { selectIsAuthenticated } from "redux/selectors/accountSelector";

import { DjPage } from "./Pages/DJ/DjPage";
import { TracksList } from "./Pages/Tracks/TracksList";
import { KidsDjPage } from "./Pages/DJ/KidsDjPage";

const Routing = () => {
  const isAuth = useSelector(selectIsAuthenticated);

  return (
    <>
      <Routes>
        <Route exact path="/account/login" element={<Login />} />
        <Route exact path="/account/signup" element={<Signup />} />
        <Route exact path="/account/reset/password" element={<EmailCheck />} />
        <Route
          exact
          path="/account/reset/password/:email/:otp"
          element={<PasswordForm />}
        />
        <Route
          exact
          path="/tracks"
          element={<TracksList />}
        />

        {/* Protected routes here */}

        <Route
          exact
          path="/home"
          element={
            <ProtectedRoute isLoggedIn={isAuth}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/dj"
          element={
            <ProtectedRoute isLoggedIn={isAuth}>
              <DjPage />
              {/* <TracksList/> */}
            </ProtectedRoute>
          }
        />

      <Route
          exact
          path="/kids-dj"
          element={
            <ProtectedRoute isLoggedIn={isAuth}>
              <KidsDjPage />
              {/* <TracksList/> */}
            </ProtectedRoute>
          }
        />
        <Route exact path="*" element={<Navigate to="/account/login" />} />
      </Routes>
    </>
  );
};
export default Routing;
