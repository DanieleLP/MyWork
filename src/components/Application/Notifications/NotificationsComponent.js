import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../../firebase";

import "./NotificationsComponent.css";
const NotificationsComponent = () => {
  const { userUid } = useParams();
  const [notifications, setNotifications] = useState([]);

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
                snapshot.docs.map((notification) => notification.data())
              )
            )
        )
      );
  }, [userUid]);

  return (
    notifications && (
      <div className="notificationsComponent">
        {notifications && notifications.length > 0 ? (
          <p>Le tue notifiche:</p>
        ) : (
          <p>
            Non hai nessuna notifica al momento! <br />
            <Link to="/">Torna alla home page</Link>
          </p>
        )}
        <ul>
          {notifications.map((notification) => (
            <li className="notificationsComponent__notification">
              {notification.type === 0 && (
                <>
                  {notification.message}{" "}
                  <Link to={`/projects/${notification.ref}`}>(visualizza)</Link>
                </>
              )}
              {notification.type === 1 && (
                <>
                  {notification.message}{" "}
                  <Link
                    to={`/projects/${notification.projectRef}/activity/${notification.ref}`}
                  >
                    (visualizza)
                  </Link>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default NotificationsComponent;
