import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebaseApp from "../../firebase";
import errorParser from "../../libs/errorParser";
import "./RegisterComponent.css";
const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [error, setError] = useState("");
  let history = useHistory();
  const register = (e) => {
    e.preventDefault();
    if (password !== repPassword) {
      setError("Le password devono corrispondere!");
    } else if (password.length < 6) {
      setError("La password deve essere composta da almeno 6 caratteri!");
    } else {
      firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => history.push("/"))
        .catch((error) => {
          setError(errorParser(error.code));
        });
    }
  };

  return (
    <div className="registerComponent">
      <div className="registerComponent__container">
        <div className="registerComponent__header">
          <h1>MyWork</h1>
          <span className="loginComponent__error">{error}</span>
        </div>
        <div className="registerComponent__content">
          <form>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Inserisci un indirizzo email"
              onChange={(e) => setEmail(e.currentTarget.value)}
              onKeyDown={(e) => (e.keyCode === 13 ? register(e) : null)}
            />
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Crea una password"
              onChange={(e) => setPassword(e.currentTarget.value)}
              onKeyDown={(e) => (e.keyCode === 13 ? register(e) : null)}
            />
            <input
              type="password"
              name="repPassword"
              value={repPassword}
              placeholder="Re-inserisci la tua password"
              onChange={(e) => setRepPassword(e.currentTarget.value)}
              onKeyDown={(e) => (e.keyCode === 13 ? register(e) : null)}
            />
            <div
              className="registerComponent__btn"
              onClick={(e) => register(e)}
            >
              Registrati
            </div>
            <p>
              Hai già un account? <Link to="/login">Accedi!</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
