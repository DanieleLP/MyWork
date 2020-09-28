/* 
  SettingsComponent
  component per la pagina delle impostazioni dell'utente
*/
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { themeChanger } from "../../../libs/themeChanger";
import "./SettingsComponent.css";

const SettingsComponent = (props) => {
  const { userUid } = useParams();
  const [user, setUser] = useState({});

  // fetch real-time dei dati dell'utente attuale
  useEffect(() => {
    let isRendered = false;
    db.collection("users")
      .where("uid", "==", userUid)
      .onSnapshot((snapshot) =>
        snapshot.docs.forEach((user) => {
          if (!isRendered) {
            setUser(user.data());
          }
        })
      );
    return () => {
      isRendered = true;
    };
  }, [userUid]);

  // chiamata alla funzione della libreria changeTheme per cambiare il tema dell'applicazione
  const changeTheme = (e) => {
    localStorage.setItem("theme", themeChanger(e.currentTarget.className));
  };

  return (
    user && (
      <div className="settingsComponent">
        <div className="settingsComponent__container">
          <h2>
            {user.name} {user.lastName}
          </h2>
          <hr />
          <p>Seleziona il tema:</p>
          <div className="settingsComponent__themeList">
            <div
              className="settingsComponent__theme default"
              onClick={(e) => changeTheme(e)}
            ></div>
            <div
              className="settingsComponent__theme yellow"
              onClick={(e) => changeTheme(e)}
            ></div>
            <div
              className="settingsComponent__theme green"
              onClick={(e) => changeTheme(e)}
            ></div>
            <div
              className="settingsComponent__theme blue"
              onClick={(e) => changeTheme(e)}
            ></div>
            <div
              className="settingsComponent__theme petrol"
              onClick={(e) => changeTheme(e)}
            ></div>
            <div
              className="settingsComponent__theme smokeblue"
              onClick={(e) => changeTheme(e)}
            ></div>
          </div>
        </div>
      </div>
    )
  );
};

export default SettingsComponent;
