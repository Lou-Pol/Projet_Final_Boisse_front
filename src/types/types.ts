export interface UtilisateurConnecte {
  id: number;
  nom: string;
  email: string;
  role: "admin" | "user";
}

export interface Client {
  id: number;
  nom: string;
  email: string;
}

export interface Produit {
  id: number;
  nom: string;
  prix: number;
  stock: number;
  categorie: string;
}

export interface LigneCommande {
  id: number;
  quantite: number;
  produit: Produit;
}

export interface Commande {
  id: number;
  client: Client;
  statut: "EN_COURS" | "LIVREE";
  lignes: LigneCommande[];
}

export interface UtilisateurAdmin {
  idJsonPlaceholder: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | null;
}
