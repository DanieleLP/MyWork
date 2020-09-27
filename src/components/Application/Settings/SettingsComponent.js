import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db } from "../../../firebase";
import "./SettingsComponent.css";
const SettingsComponent = () => {
  const { userUid } = useParams();
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const history = useHistory();

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
    console.log("wat");
    if (name && lastName) {
      db.collection("users")
        .where("uid", "==", userUid)
        .onSnapshot((snapshot) =>
          snapshot.docs.forEach((user) => {
            db.collection("users")
              .doc(user.id)
              .update({ name, lastName })
              .then((ref) => history.push("/"));
          })
        );
    }

    setName("");
    setLastName("");
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
        </div>
      </div>
    )
  );
};

export default SettingsComponent;
