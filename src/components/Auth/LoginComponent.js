import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebaseApp from "../../firebase";
import errorParser from "../../libs/errorParser";
import "./LoginComponent.css";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let history = useHistory();

  const login = (e) => {
    e.preventDefault();
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => history.push("/"))
      .catch((error) => {
        setError(errorParser(error.code));
      });
  };

  return (
    <div className="loginComponent">
      <div className="loginComponent__container">
        <div className="loginComponent__header">
          <h1>MyWork</h1>
          <span className="loginComponent__error">{error}</span>
        </div>
        <div className="loginComponent__content">
          <form>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Inserisci la tua email"
              onKeyDown={(e) => (e.keyCode === 13 ? login(e) : null)}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Inserisci la tua password"
              onKeyDown={(e) => (e.keyCode === 13 ? login(e) : null)}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <div className="loginComponent__btn" onClick={(e) => login(e)}>
              Accedi
            </div>
            <p>
              Non hai ancora un account? <Link to="/register">Registrati!</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
