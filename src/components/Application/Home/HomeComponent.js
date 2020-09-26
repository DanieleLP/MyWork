import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../providers/Auth";
import { db } from "../../../firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AddIcon from "@material-ui/icons/Add";

import "./HomeComponent.css";
const HomeComponent = () => {
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    db.collection("users")
      .where("uid", "==", currentUser.uid)
      .onSnapshot((snap) =>
        snap.docs.map((user) =>
          setName(`${user.data().name} ${user.data().lastName}`)
        )
      );

    db.collection("users")
      .where("uid", "==", currentUser.uid)
      .onSnapshot((snap) =>
        snap.docs.map((user) =>
          db
            .collection("users")
            .doc(user.id)
            .collection("notifications")
            .onSnapshot((snapshot) =>
              setNotifications(
                snapshot.docs.map((notification) => notification.data())
              )
            )
        )
      );
  }, [currentUser]);
  return (
    <div className="homeComponent">
      <h2>
        <span className="homeComponent-nb">Benvenuto</span> {name}!
      </h2>
      <p>
        Hai attualmente{" "}
        <Link to={`/notifications/${currentUser.uid}`}>
          {notifications.length} notifiche
        </Link>
        !
      </p>
      <hr />
      <p>
        Puoi accedere alle funzionalità della piattaforma dal menù laterale:
      </p>
      <ul>
        <li>
          Accedi alle tue notifiche dall'icona <NotificationsIcon />;
        </li>
        <li>
          Accedi alle impostazioni del tuo account dall'icona <SettingsIcon />;
        </li>
        <li>
          Effettua il log-out dall'icona <ExitToAppIcon />;
        </li>
        <li>
          Accedi ai progetti a cui lavori cliccando sul nome che li rappresenta;
        </li>
        <li>
          Aggiungi un nuovo progetto dal bottone con l'icona <AddIcon />;
        </li>
        <li>
          Per ogni progetto aggiungi una nuova attività con il "fab" in basso a
          destra con l'icona <AddIcon />.
        </li>
      </ul>
    </div>
  );
};

export default HomeComponent;
