import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";

const MiseEnPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const estLogin = location.pathname === "/login";

  return (
    <>
      {!estLogin && <Navigation />}
      <main>{children}</main>
    </>
  );
};

export default MiseEnPage;
