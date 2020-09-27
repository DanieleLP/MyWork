import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { themeChanger } from "../../../libs/themeChanger";
import "./SettingsComponent.css";
const SettingsComponent = () => {
  const { userUid } = useParams();
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

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

  const update = (e) => {
    if (name && lastName) {
      db.collection("users")
        .where("uid", "==", userUid)
        .onSnapshot((snapshot) =>
          snapshot.docs.forEach((user) => {
            db.collection("users")
              .doc(user.id)
              .update({ name, lastName })
              .then((ref) => window.location.reload());
          })
        );
    }

    setName("");
    setLastName("");
  };

  const changeTheme = (e) => {
    themeChanger(e.currentTarget.className);
  };

  return (
    user && (
      <div className="settingsComponent">
        <div className="settingsComponent__container">
          <h2>
            {user.name} {user.lastName}
          </h2>
          <hr />
          <p>Cambia nome e cognome associati all'account:</p>
          <input
            type="text"
            name="name"
            value={name}
            onKeyDown={(e) => (e.keyCode === 13 ? update(e) : null)}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Inserisci il nuovo nome..."
          />
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.currentTarget.value)}
            onKeyDown={(e) => (e.keyCode === 13 ? update(e) : null)}
            placeholder="Inserisci il nuovo cognome..."
          />
          <div className="settingsComponent__btn" onClick={(e) => update(e)}>
            <p>Aggiorna</p>
          </div>
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
              className="settingsComponent__theme lightblue"
              onClick={(e) => changeTheme(e)}
            ></div>
            <div
              className="settingsComponent__theme purple"
              onClick={(e) => changeTheme(e)}
            ></div>
            <div
              className="settingsComponent__theme petrol"
              onClick={(e) => changeTheme(e)}
            ></div>
          </div>
        </div>
      </div>
    )
  );
};

export default SettingsComponent;
