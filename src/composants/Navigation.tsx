import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexte/AuthContexte";

const Navigation: React.FC = () => {
  const { utilisateur, deconnexion } = useAuth();

  const role = utilisateur?.role?.toLowerCase();

  return (
    <header className="topbar">
      <nav>
        <Link to="/">Dashboard</Link>

        {role === "user" && (
          <>
            <Link to="/clients">Clients</Link>
            <Link to="/produits">Produits</Link>
            <Link to="/commandes">Commandes</Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin/users">Admin utilisateurs</Link>
          </>
        )}
      </nav>

      <div className="droite">
        {utilisateur ? (
          <>
            <span>
              {utilisateur.nom} ({role})
            </span>
            <button className="deconnexion" onClick={deconnexion}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </div>
    </header>
  );
};

export default Navigation;
