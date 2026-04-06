import React, { useEffect, useState } from "react";
import { apiClients, apiCommandes } from "../services/apiBackend";
import { Client, Commande } from "../types/types";

const PageClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [editionId, setEditionId] = useState<number | null>(null);

  const [commandesClient, setCommandesClient] = useState<Commande[]>([]);
  const [clientSelectionne, setClientSelectionne] = useState<Client | null>(null);

  const user = JSON.parse(localStorage.getItem("utilisateur") || "null");
  const estAdmin = user?.role === "ADMIN";

  const charger = async () => {
    setClients(await apiClients.lister());
  };

  useEffect(() => {
    charger();
  }, []);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !email) return;

    if (editionId) {
      await apiClients.maj(editionId, { nom, email });
    } else {
      await apiClients.creer({ nom, email });
    }

    setNom("");
    setEmail("");
    setEditionId(null);
    await charger();
  };

  const commencerEdition = (c: Client) => {
    setEditionId(c.id);
    setNom(c.nom);
    setEmail(c.email);
  };

  const supprimer = async (id: number) => {
    await apiClients.supprimer(id);
    await charger();
  };

  const voirCommandes = async (client: Client) => {
    const commandes = await apiCommandes.listerParClient(client.id);
    setClientSelectionne(client);
    setCommandesClient(commandes);
  };

  return (
    <div>
      <h1>Clients</h1>

      {!estAdmin && (
        <form onSubmit={soumettre} className="formulaire">
          <h2>{editionId ? "Modifier un client" : "Ajouter un client"}</h2>

          <label>
            Nom
            <input value={nom} onChange={(e) => setNom(e.target.value)} />
          </label>

          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <button type="submit">{editionId ? "Mettre à jour" : "Créer"}</button>

          {editionId && (
            <button
              type="button"
              onClick={() => {
                setEditionId(null);
                setNom("");
                setEmail("");
              }}
            >
              Annuler
            </button>
          )}
        </form>
      )}

      <h2>Liste des clients</h2>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Commandes</th>
            {!estAdmin && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.nom}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => voirCommandes(c)}>
                  Voir commandes
                </button>
              </td>

              {!estAdmin && (
                <td>
                  <button onClick={() => commencerEdition(c)}>Modifier</button>
                  <button onClick={() => supprimer(c.id)}>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {clientSelectionne && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Commandes de {clientSelectionne.nom}</h2>
          {commandesClient.length === 0 && <p>Aucune commande.</p>}
          {commandesClient.length > 0 && (
            <ul>
              {commandesClient.map((cmd) => (
                <li key={cmd.id}>
                  <strong>{cmd.statut}</strong> –{" "}
                  {cmd.lignes.map((l) => `${l.produit.nom} x ${l.quantite}`).join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PageClients;
