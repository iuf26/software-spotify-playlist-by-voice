import React, { useState, createContext } from "react";

export const AppContext = createContext();

export function AppContextProvider(props) {
  const [isAuth, setIsAuth] = useState();

  return <AppContext.Provider value={{ isAuth, setIsAuth }} {...props} />;
}
