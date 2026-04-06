import axios from "axios";
import { Client, Produit, Commande, UtilisateurAdmin } from "../types/types";

const URL_BACKEND = (import.meta as any).env.VITE_API_URL;

const instance = axios.create({
  baseURL: URL_BACKEND
});

instance.interceptors.request.use((config) => {
  const brut = localStorage.getItem("token");
  if (brut) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${brut}`;
  }
  return config;
});

// AUTH
export const apiAuth = {
  async login(email: string) {
    const rep = await instance.post("/auth/login", { email });
    return rep.data;
  }
};


// CLIENTS
export const apiClients = {
  async lister(): Promise<Client[]> {
    const rep = await instance.get("/clients");
    return rep.data;
  },

  async creer(data: { nom: string; email: string }): Promise<Client> {
    const rep = await instance.post("/clients", data);
    return rep.data;
  },

  async maj(id: number, data: { nom: string; email: string }): Promise<Client> {
    const rep = await instance.put(`/clients/${id}`, data);
    return rep.data;
  },

  async supprimer(id: number): Promise<void> {
    await instance.delete(`/clients/${id}`);
  }
};


// PRODUITS
export const apiProduits = {
  async lister(): Promise<Produit[]> {
    const rep = await instance.get("/produits");
    return rep.data;
  },

  async creer(data: { nom: string; prix: number; stock: number; categorie: string }): Promise<Produit> {
    const rep = await instance.post("/produits", data);
    return rep.data;
  },

  async maj(id: number, data: { nom: string; prix: number; stock: number; categorie: string }): Promise<Produit> {
    const rep = await instance.put(`/produits/${id}`, data);
    return rep.data;
  },

  async supprimer(id: number): Promise<void> {
    await instance.delete(`/produits/${id}`);
  }
};


// COMMANDES
export const apiCommandes = {
  async lister(): Promise<Commande[]> {
    const rep = await instance.get("/commandes");
    return rep.data;
  },

  async listerParClient(idClient: number): Promise<Commande[]> {
    const rep = await instance.get(`/clients/${idClient}/commandes`);
    return rep.data;
  },

  async creer(data: { idClient: number; produits: { idProduit: number; quantite: number }[] }): Promise<Commande> {
    const rep = await instance.post("/commandes", {
      idClient: data.idClient,
      statut: "EN_COURS",
      produits: data.produits
    });
    return rep.data;
  },

  async changerStatut(id: number, statut: "EN_COURS" | "LIVREE"): Promise<Commande> {
    const rep = await instance.put(`/commandes/${id}/statut`, { statut });
    return rep.data;
  },

  async supprimer(id: number): Promise<void> {
    await instance.delete(`/commandes/${id}`);
  }
};


// ADMIN USERS
export const apiAdminUsers = {
  async lister(): Promise<UtilisateurAdmin[]> {
    const rep = await instance.get("/admin/users");
    return rep.data;
  },

  async changerRole(idJsonPlaceholder: number, role: "ADMIN" | "USER") {
    const rep = await instance.put(`/admin/users/${idJsonPlaceholder}/role`, { role });
    return rep.data;
  }
};
