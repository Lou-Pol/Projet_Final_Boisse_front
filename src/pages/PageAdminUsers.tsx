import React, { useEffect, useState } from "react";
import { apiAdminUsers } from "../services/apiBackend";
import { UtilisateurAdmin } from "../types/types";

const PageAdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UtilisateurAdmin[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = async () => {
    setErreur(null);
    try {
      setUsers(await apiAdminUsers.lister());
    } catch {
      setErreur("Erreur chargement utilisateurs");
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const changerRole = async (idJsonPlaceholder: number, role: "ADMIN" | "USER") => {
    setErreur(null);
    try {
      await apiAdminUsers.changerRole(idJsonPlaceholder, role);
      await charger();
    } catch {
      setErreur("Erreur changement rôle");
    }
  };

  return (
    <div>
      <h1>Administration des utilisateurs</h1>
      <p>
        Les utilisateurs viennent de JSONPlaceholder. Les comptes locaux (rôle)
        sont stockés en base SQLite.
      </p>

      {erreur && <p className="erreur">{erreur}</p>}

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.idJsonPlaceholder}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role ?? "non défini"}</td>
              <td>
                <select
                  value={u.role ?? ""}
                  onChange={(e) =>
                    changerRole(
                      u.idJsonPlaceholder,
                      e.target.value as "ADMIN" | "USER"
                    )
                  }
                >
                  <option value="">-- Choisir --</option>
                  <option value="ADMIN">admin</option>
                  <option value="USER">user</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PageAdminUsers;
