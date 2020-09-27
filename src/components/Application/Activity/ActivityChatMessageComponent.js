import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import "./ActivityChatMessageComponent.css";

import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

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
      <Tooltip title={name}>
        <Avatar src="/">
          {name
            .split(" ")
            .map((x) => x.charAt(0))
            .join("") || user}
        </Avatar>
      </Tooltip>
      <p>{message}</p>
      <span className="activityChatMessageComponent__timestamp">{ts}</span>
    </div>
  );
};

export default ActivityChatMessageComponent;
