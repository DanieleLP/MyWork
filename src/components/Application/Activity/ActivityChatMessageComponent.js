import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import Avatar from "@material-ui/core/Avatar";
import "./ActivityChatMessageComponent.css";

const ActivityChatMessageComponent = (props) => {
  const { user, message, timestamp } = props.message;
  const [name, setName] = useState("");

  useEffect(() => {
    db.collection("users")
      .where("uid", "==", user)
      .onSnapshot((snapshot) =>
        snapshot.docs.map((snap) =>
          setName(`${snap.data().name} ${snap.data().lastName}`)
        )
      );
  }, [user]);

  let ts = timestamp
    ? new Date(timestamp.seconds * 1000).toLocaleString()
    : null;

  return (
    <div className="activityChatMessageComponent">
      <Avatar src="/">{name || user}</Avatar>
      <p>{message}</p>
      <span className="activityChatMessageComponent__timestamp">{ts}</span>
    </div>
  );
};

export default ActivityChatMessageComponent;
