import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import "./ActivityUpdateComponent.css";
const ActivityUpdateComponent = (props) => {
  const { user, description, hours, timestamp } = props.update;
  const [name, setName] = useState("");
  let ts = timestamp
    ? new Date(timestamp.seconds * 1000).toLocaleString()
    : null;

  useEffect(() => {
    db.collection("users")
      .where("uid", "==", user)
      .onSnapshot((snapshot) =>
        snapshot.docs.map((snap) =>
          setName(`${snap.data().name} ${snap.data().lastName}`)
        )
      );
  }, [user]);

  return (
    <div className="activityUpdateComponent">
      <div className="activityUpdateComponent__description">
        <p>
          <span className="activityUpdateComponent__b">descrizione:</span>{" "}
          {description}
        </p>
      </div>
      <div className="activityUpdateComponent__details">
        <p>
          <span className="activityUpdateComponent__b">da:</span> {name || user}
        </p>
        <p>
          <span className="activityUpdateComponent__b">ore: </span> {hours}
        </p>
        <p>
          <span className="activityUpdateComponent__b">data: </span> {ts}
        </p>
      </div>
    </div>
  );
};

export default ActivityUpdateComponent;
