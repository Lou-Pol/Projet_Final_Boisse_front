import React from "react";
import { Link } from "react-router-dom";

interface Props {
  titre: string;
  valeur: number;
  lien: string;
}

const CarteStatistique: React.FC<Props> = ({ titre, valeur, lien }) => {
  return (
    <Link to={lien} className="carte">
      <h3>{titre}</h3>
      <div className="valeur">{valeur}</div>
    </Link>
  );
};

export default CarteStatistique;
