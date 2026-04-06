import React, { useEffect, useState } from "react";
import { apiClients, apiProduits, apiCommandes } from "../services/apiBackend";
import { Client, Produit, Commande } from "../types/types";
import FormulaireCommande from "../composants/FormulaireCommande";

const PageCommandes: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);

  const [idClient, setIdClient] = useState<string>("");
  const [idProduit, setIdProduit] = useState<string>("");
  const [quantite, setQuantite] = useState<string>("1");
  const [lignes, setLignes] = useState<{ idProduit: number; quantite: number }[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("utilisateur") || "null");
  const estAdmin = user?.role?.toLowerCase() === "admin";

  const charger = async () => {
    setClients(await apiClients.lister());
    setProduits(await apiProduits.lister());
    setCommandes(await apiCommandes.lister());
  };

  useEffect(() => {
    charger();
  }, []);

  const ajouterLigne = () => {
  if (!idProduit || !quantite) return;

  const prod = produits.find((p) => p.id === Number(idProduit));
  if (!prod) return;

  const qte = Number(quantite);

  if (qte > prod.stock) {
    setErreur(`Stock insuffisant : il reste seulement ${prod.stock} unités.`);
    return;
  }

  setLignes([...lignes, { idProduit: Number(idProduit), quantite: qte }]);
  setIdProduit("");
  setQuantite("1");
  setErreur(null);
};

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);

    const idC = Number(idClient);
    if (!idC || lignes.length === 0) {
      setErreur("Client et au moins un produit requis");
      return;
    }

    await apiCommandes.creer({
      idClient: Number(idClient),
      produits: lignes
    });

    setIdClient("");
    setIdProduit("");
    setQuantite("1");
    setLignes([]);

    await charger();
  };

  const changerStatut = async (id: number, statut: "EN_COURS" | "LIVREE") => {
    await apiCommandes.changerStatut(id, statut);
    await charger();
  };

  const supprimerCommande = async (id: number) => {
    await apiCommandes.supprimer(id);
    await charger();
  };

  return (
    <div>
      <h1>Commandes</h1>

      {/* FORMULAIRE VISIBLE UNIQUEMENT POUR USER */}
      {!estAdmin && (
        <FormulaireCommande
          clients={clients}
          produits={produits}
          idClient={idClient}
          setIdClient={setIdClient}
          idProduit={idProduit}
          setIdProduit={setIdProduit}
          quantite={quantite}
          setQuantite={setQuantite}
          lignes={lignes}
          ajouterLigne={ajouterLigne}
          soumettre={soumettre}
          erreur={erreur}
        />
      )}

      <h2>Liste des commandes</h2>

      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Statut</th>
            <th>Lignes</th>
            {!estAdmin && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {commandes.map((c) => (
            <tr key={c.id}>
              <td>{c.client.nom}</td>
              <td>{c.statut}</td>
              <td>
                <ul>
                  {c.lignes.map((l) => (
                    <li key={l.id}>
                      {l.produit.nom} x {l.quantite}
                    </li>
                  ))}
                </ul>
              </td>

              {/* ACTIONS UNIQUEMENT POUR USER */}
              {!estAdmin && (
                <td>
                  {c.statut === "EN_COURS" && (
                    <button onClick={() => changerStatut(c.id, "LIVREE")}>
                      Marquer livrée
                    </button>
                  )}

                  {c.statut === "LIVREE" && (
                    <button onClick={() => changerStatut(c.id, "EN_COURS")}>
                      Remettre en cours
                    </button>
                  )}

                  <button
                    style={{ marginLeft: "10px", color: "red" }}
                    onClick={() => supprimerCommande(c.id)}
                  >
                    Supprimer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PageCommandes;
