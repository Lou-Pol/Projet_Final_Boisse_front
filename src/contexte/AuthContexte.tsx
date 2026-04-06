import React, { createContext, useContext, useEffect, useState } from "react";
import { apiAuth } from "../services/apiBackend";
import { UtilisateurConnecte } from "../types/types";

interface AuthContexteValeur {
  utilisateur: UtilisateurConnecte | null;
  estCharge: boolean;
  connexion: (email: string) => Promise<void>; 
  deconnexion: () => void;
}

const AuthContexte = createContext<AuthContexteValeur | undefined>(undefined);

export const AuthFournisseur: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState<UtilisateurConnecte | null>(null);
  const [estCharge, setEstCharge] = useState(false);

  useEffect(() => {
    const brutUser = localStorage.getItem("utilisateur");
    const brutToken = localStorage.getItem("token");
    if (brutUser && brutToken) {
      setUtilisateur(JSON.parse(brutUser));
    }
    setEstCharge(true);
  }, []);

  const connexion = async (email: string) => {
    const data = await apiAuth.login(email); 
    localStorage.setItem("token", data.token);
    localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
    setUtilisateur(data.utilisateur);
  };

  const deconnexion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");
    setUtilisateur(null);
  };

  return (
    <AuthContexte.Provider value={{ utilisateur, estCharge, connexion, deconnexion }}>
      {children}
    </AuthContexte.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContexte);
  if (!ctx) throw new Error("useAuth hors AuthFournisseur");
  return ctx;
};
