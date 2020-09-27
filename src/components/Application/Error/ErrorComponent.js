import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./ErrorComponent.css";

const ErrorComponent = (props) => {
  const history = useHistory();

  return (
    <div
      className="errorComponent"
      onClick={(e) => {
        if (e.target.className === "errorComponent") {
          history.push("/");
        }
      }}
    >
      <div className="errorComponent__container">
        <h2>Errore</h2>
        <p>
          La risorsa a cui stai cercando di accedere non esiste oppure il tuo
          accesso è limitato.
        </p>
        <Link to="/">torna alla pagina iniziale</Link>
      </div>
    </div>
  );
};

export default ErrorComponent;
