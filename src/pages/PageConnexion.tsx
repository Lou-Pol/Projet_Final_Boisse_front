import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexte/AuthContexte";

const PageConnexion: React.FC = () => {
  const [email, setEmail] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);

  const { connexion } = useAuth();
  const navigate = useNavigate();

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);

    try {
      await connexion(email); // plus de mot de passe
      navigate("/");
    } catch (e: any) {
      setErreur(e?.response?.data?.message ?? "Erreur de connexion");
    }
  };

  return (
    <div className="page-centrer">
      <form onSubmit={gererSoumission} className="formulaire">
        <h2>Connexion</h2>

        {erreur && <p className="erreur">{erreur}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Email JSONPlaceholder"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Se connecter</button>

        <p className="hint">
          Utilise un email JSONPlaceholder.  
          Le premier utilisateur connecté devient administrateur.
        </p>
      </form>
    </div>
  );
};

export default PageConnexion;
