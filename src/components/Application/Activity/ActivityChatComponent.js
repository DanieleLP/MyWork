/* 
  ActivityChatComponent
  component contenitore dei messaggi della chat;
  fornisce funzionalità di invio dei messaggi
*/

import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { db, Timestamp } from "../../../firebase";
import { AuthContext } from "../../../providers/Auth";
import "./ActivityChatComponent.css";

import ActivityChatMessageComponent from "./ActivityChatMessageComponent";

const ActivityChatComponent = () => {
  const { activityId, projectId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // fetch realtime di tutti i messaggi presenti per l'attività con activityId del progetto con projectId
  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .collection("activities")
      .doc(activityId)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((message) => message.data()))
      );
  }, [activityId, projectId]);

  // invio real-time del commento e della notifica a tutti gli utenti partecipanti a questa attività
  const submit = (e) => {
    db.collection("projects")
      .doc(projectId)
      .collection("activities")
      .doc(activityId)
      .collection("messages")
      .add({
        user: currentUser.uid,
        message,
        timestamp: Timestamp,
      })
      .then((messageRef) => {
        db.collection("users")
          .where("uid", "==", currentUser.uid)
          .onSnapshot((users) =>
            users.docs.forEach((user) => {
              db.collection("projects")
                .doc(projectId)
                .collection("activities")
                .doc(activityId)
                .onSnapshot((snapshot) => {
                  snapshot.data().participants.forEach((participant) => {
                    db.collection("users")
                      .where("uid", "==", participant.uid)
                      .onSnapshot((pUsers) =>
                        pUsers.docs.forEach((p) => {
                          let dbRef = db
                            .collection("users")
                            .doc(p.id)
                            .collection("notifications")
                            .doc();
                          if (p.data().uid !== currentUser.uid) {
                            dbRef.set({
                              type: 2,
                              message: `${user.data().name} ${
                                user.data().lastName
                              } ha scritto "${message}".`,
                              notificationRef: dbRef.id,
                              projectRef: projectId,
                              activityRef: activityId,
                              messageRef: messageRef.id,
                              timestamp: Timestamp,
                              status: 0,
                            });
                          }
                        })
                      );
                  });
                });
            })
          );
      });
    setMessage("");
  };

  return (
    <div className="activityChatComponent">
      <div className="activityChatComponent__messages-list">
        {messages &&
          messages.map((message) => (
            <ActivityChatMessageComponent
              key={message.timestamp}
              message={message}
            />
          ))}
      </div>
      <input
        type="text"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        placeholder="Inserisci un messaggio (premi invio per inviare)..."
        onKeyDown={(e) => (e.keyCode === 13 ? submit(e) : null)}
      />
    </div>
  );
};

export default ActivityChatComponent;
