import { useDispatch } from "react-redux";

import { AccountActions } from "redux/slices/accountSlice";

export const useAccount = () => {
  const dispatch = useDispatch();

  const login = (username) => {
    dispatch(AccountActions.authenticate({username}));
  };

  const addSpotify = () => {
    dispatch(AccountActions.authenticateSpotify());
  };

  const logout = () => {
    dispatch(AccountActions.logout());
  };

  return { login, logout, addSpotify };
};
