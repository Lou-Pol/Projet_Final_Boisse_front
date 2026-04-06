import React, { useEffect, useState } from "react";
import { apiProduits } from "../services/apiBackend";
import { Produit } from "../types/types";

const PageProduits: React.FC = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [categorie, setCategorie] = useState("");
  const [editionId, setEditionId] = useState<number | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("utilisateur") || "null");
  const estAdmin = user?.role === "ADMIN";

  const charger = async () => {
    setProduits(await apiProduits.lister());
  };

  useEffect(() => {
    charger();
  }, []);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);

    if (!nom || !categorie || !prix || !stock) {
      setErreur("Tous les champs sont obligatoires");
      return;
    }

    const prixNum = Number(prix);
    const stockNum = Number(stock);

    if (isNaN(prixNum) || prixNum < 0) {
      setErreur("Prix invalide");
      return;
    }

    if (!Number.isInteger(stockNum) || stockNum < 0) {
      setErreur("Stock invalide");
      return;
    }

    if (editionId) {
      await apiProduits.maj(editionId, {
        nom,
        prix: prixNum,
        stock: stockNum,
        categorie
      });
    } else {
      await apiProduits.creer({
        nom,
        prix: prixNum,
        stock: stockNum,
        categorie
      });
    }

    setNom("");
    setPrix("");
    setStock("");
    setCategorie("");
    setEditionId(null);
    await charger();
  };

  const commencerEdition = (p: Produit) => {
    setEditionId(p.id);
    setNom(p.nom);
    setPrix(p.prix.toString());
    setStock(p.stock.toString());
    setCategorie(p.categorie);
  };

  const supprimer = async (id: number) => {
    await apiProduits.supprimer(id);
    await charger();
  };

  return (
    <div>
      <h1>Produits</h1>

      {!estAdmin && (
        <form onSubmit={soumettre} className="formulaire">
          <h2>{editionId ? "Modifier un produit" : "Ajouter un produit"}</h2>

          {erreur && <p className="erreur">{erreur}</p>}

          <label>
            Nom
            <input value={nom} onChange={(e) => setNom(e.target.value)} />
          </label>

          <label>
            Prix
            <input
              type="text"
              value={prix}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*([.,]\d{0,2})?$/.test(val)) {
                  setPrix(val.replace(",", "."));
                }
              }}
            />
          </label>

          <label>
            Stock
            <input
              type="text"
              value={stock}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setStock(val);
                }
              }}
            />
          </label>

          <label>
            Catégorie
            <input value={categorie} onChange={(e) => setCategorie(e.target.value)} />
          </label>

          <button type="submit">{editionId ? "Mettre à jour" : "Créer"}</button>

          {editionId && (
            <button
              type="button"
              onClick={() => {
                setEditionId(null);
                setNom("");
                setPrix("");
                setStock("");
                setCategorie("");
                setErreur(null);
              }}
            >
              Annuler
            </button>
          )}
        </form>
      )}

      <h2>Liste des produits</h2>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Catégorie</th>
            {!estAdmin && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {produits.map((p) => (
            <tr key={p.id}>
              <td>{p.nom}</td>
              <td>{p.prix.toFixed(2)} €</td>
              <td>{p.stock}</td>
              <td>{p.categorie}</td>

              {!estAdmin && (
                <td>
                  <button onClick={() => commencerEdition(p)}>Modifier</button>
                  <button onClick={() => supprimer(p.id)}>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PageProduits;
