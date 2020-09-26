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
