/* 
  NotificationsComponent
  component per la pagina delle notifiche
  fornisce funzionalità di lettura e check delle notifiche
*/
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../../firebase";
import "./NotificationsComponent.css";

const NotificationsComponent = () => {
  const { userUid } = useParams();
  const [notifications, setNotifications] = useState([]);

  // fetch real time delle notifiche dell'utente attuale, in ordine decrescente di tempo
  useEffect(() => {
    db.collection("users")
      .where("uid", "==", userUid)
      .onSnapshot((snap) =>
        snap.docs.map((user) =>
          db
            .collection("users")
            .doc(user.id)
            .collection("notifications")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
              setNotifications(
                snapshot.docs
                  .filter((snap) => snap.data().status === 0)
                  .map((notification) => notification.data())
              )
            )
        )
      );
  }, [userUid]);

  // funzione per "leggere" la notifica
  const mark = (e, notification) => {
    db.collection("users")
      .where("uid", "==", userUid)
      .onSnapshot((snap) =>
        snap.docs.map((user) =>
          db
            .collection("users")
            .doc(user.id)
            .collection("notifications")
            .doc(notification.notificationRef)
            .update({ status: 1 })
        )
      );
  };

  // funzione per "leggere" tutte le notifiche
  const markAll = (e) => {
    db.collection("users")
      .where("uid", "==", userUid)
      .onSnapshot((snap) =>
        snap.docs.map((user) =>
          db
            .collection("users")
            .doc(user.id)
            .collection("notifications")
            .onSnapshot((notifications) =>
              notifications.forEach((notification) =>
                notification.ref.update({ status: 1 })
              )
            )
        )
      );
  };

  return (
    notifications &&
    notifications !== undefined && (
      <div className="notificationsComponent">
        {notifications && notifications.length > 0 ? (
          <p>Le tue notifiche:</p>
        ) : (
          <p>
            Non hai nessuna notifica al momento! <br />
            <Link to="/">Torna alla home page</Link>
          </p>
        )}
        {notifications.length > 0 && (
          <ul>
            {notifications.map((notification) => (
              <li className="notificationsComponent__notification">
                {notification && notification.type === 0 && (
                  <>
                    {notification.message}
                    <Link
                      onClick={(e, not) => mark(e, notification)}
                      to={`/projects/${notification.ref}`}
                    >
                      (visualizza)
                    </Link>
                  </>
                )}
                {notification && notification.type === 1 && (
                  <>
                    {notification.message}
                    <Link
                      onClick={(e, not) => mark(e, notification)}
                      to={`/projects/${notification.projectRef}/activity/${notification.ref}`}
                    >
                      (visualizza)
                    </Link>
                  </>
                )}
                {notification && notification.type === 2 && (
                  <>
                    {notification.message}
                    <Link
                      onClick={(e, not) => mark(e, notification)}
                      to={`/projects/${notification.projectRef}/activity/${notification.activityRef}`}
                    >
                      (visualizza)
                    </Link>
                  </>
                )}
                {notification && notification.type === 3 && (
                  <>
                    {notification.message}
                    <Link
                      onClick={(e, not) => mark(e, notification)}
                      to={`/projects/${notification.projectRef}/activity/${notification.activityRef}`}
                    >
                      (visualizza)
                    </Link>
                  </>
                )}
                {notification && notification.type === 4 && (
                  <>
                    {notification.message}
                    <Link
                      onClick={(e, not) => mark(e, notification)}
                      to={`/projects/${notification.projectRef}/activity/${notification.activityRef}`}
                    >
                      (visualizza)
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {notifications && notifications.length > 0 && (
          <div
            className="notificationsComponent__markAllBtn"
            onClick={(e) => markAll(e)}
          >
            <p>Segna tutto come letto</p>
          </div>
        )}
      </div>
    )
  );
};

export default NotificationsComponent;
