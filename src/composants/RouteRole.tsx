import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexte/AuthContexte";

export const RouteRole: React.FC<{ role: "admin" | "user"; children: React.ReactNode }> = ({
  role,
  children
}) => {
  const { utilisateur, estCharge } = useAuth();
  if (!estCharge) return <p>Chargement...</p>;
  if (!utilisateur) return <Navigate to="/login" replace />;
  if (utilisateur.role !== role) return <p>Accès refusé</p>;
  return <>{children}</>;
};
