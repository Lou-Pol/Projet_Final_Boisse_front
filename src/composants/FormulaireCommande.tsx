import React from "react";
import { Client, Produit } from "../types/types";

interface Props {
  clients: Client[];
  produits: Produit[];
  idClient: string;
  setIdClient: (v: string) => void;
  idProduit: string;
  setIdProduit: (v: string) => void;
  quantite: string;
  setQuantite: (v: string) => void;
  lignes: { idProduit: number; quantite: number }[];
  ajouterLigne: () => void;
  soumettre: (e: React.FormEvent) => void;
  erreur: string | null;
}

const FormulaireCommande: React.FC<Props> = ({
  clients,
  produits,
  idClient,
  setIdClient,
  idProduit,
  setIdProduit,
  quantite,
  setQuantite,
  lignes,
  ajouterLigne,
  soumettre,
  erreur
}) => {
  return (
    <form onSubmit={soumettre} className="formulaire">
      <h2>Créer une commande</h2>

      {erreur && <p className="erreur">{erreur}</p>}

      <label>
        Client
        <select value={idClient} onChange={(e) => setIdClient(e.target.value)}>
          <option value="">-- Choisir un client --</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom} ({c.email})
            </option>
          ))}
        </select>
      </label>

      <div className="ligne-produit">
        <label>
          Produit
          <select value={idProduit} onChange={(e) => setIdProduit(e.target.value)}>
            <option value="">-- Choisir un produit --</option>
            {produits
              .filter((p) => p.stock > 0)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} (stock: {p.stock})
                </option>
              ))}

          </select>
        </label>

        <label>
          Quantité
          <input
            type="number"
            min={1}
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
        </label>

        <button type="button" onClick={ajouterLigne}>
          Ajouter
        </button>
      </div>

      {lignes.length > 0 && (
        <ul>
          {lignes.map((l, i) => {
            const prod = produits.find((p) => p.id === l.idProduit);
            return (
              <li key={i}>
                {prod?.nom} x {l.quantite}
              </li>
            );
          })}
        </ul>
      )}

      <div className="commande-actions">
        <button type="submit">Créer la commande</button>
      </div>
    </form>
  );
};

export default FormulaireCommande;
