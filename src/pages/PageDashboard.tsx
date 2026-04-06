import React, { useEffect, useState } from "react";
import { apiClients, apiProduits, apiCommandes } from "../services/apiBackend";
import CarteStatistique from "../composants/CarteStatistique";
import { Client, Produit, Commande } from "../types/types";

const PageDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);

  const user = JSON.parse(localStorage.getItem("utilisateur") || "null");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; 

    const charger = async () => {
      try {
        const [c, p, co] = await Promise.all([
          apiClients.lister(),
          apiProduits.lister(),
          apiCommandes.lister(),
        ]);

        setClients(c);
        setProduits(p);
        setCommandes(co);
      } catch (err) {
        console.error("Erreur dashboard :", err);
      }
    };

    charger();
  }, []);

  return (
    <div>
      <h1>Dashboard {user?.role === "ADMIN" && "(ADMIN)"}</h1>

      <div className="cartes">
        <CarteStatistique titre="Clients" valeur={clients.length} lien="/clients" />
        <CarteStatistique titre="Produits" valeur={produits.length} lien="/produits" />
        <CarteStatistique titre="Commandes" valeur={commandes.length} lien="/commandes" />
      </div>
    </div>
  );
};

export default PageDashboard;
