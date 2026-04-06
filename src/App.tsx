import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MiseEnPage from "./composants/MiseEnPage";
import PageConnexion from "./pages/PageConnexion";
import PageDashboard from "./pages/PageDashboard";
import PageClients from "./pages/PageClients";
import PageProduits from "./pages/PageProduits";
import PageCommandes from "./pages/PageCommandes";
import PageAdminUsers from "./pages/PageAdminUsers";

import { RouteRole } from "./composants/RouteRole";
import { useAuth } from "./contexte/AuthContexte";

const App: React.FC = () => {
  const { utilisateur } = useAuth();

  return (
    <MiseEnPage>
      <Routes>
        <Route path="/login" element={<PageConnexion />} />

        <Route
          path="/"
          element={
            utilisateur ? <PageDashboard /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/clients"
          element={
            <RouteRole role="user">
              <PageClients />
            </RouteRole>
          }
        />

        <Route
          path="/produits"
          element={
            <RouteRole role="user">
              <PageProduits />
            </RouteRole>
          }
        />

        <Route
          path="/commandes"
          element={
            <RouteRole role="user">
              <PageCommandes />
            </RouteRole>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RouteRole role="admin">
              <PageAdminUsers />
            </RouteRole>
          }
        />
      </Routes>
    </MiseEnPage>
  );
};

export default App;
