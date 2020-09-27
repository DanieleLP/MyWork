import React, { useState, useEffect, useContext } from "react";
import MultiSelect from "react-multi-select-component";
import { AuthContext } from "../../../providers/Auth";
import { db, Timestamp } from "../../../firebase";
import { Close } from "@material-ui/icons";
import "./AddActivityModalComponent.css";

const AddActivityModalComponent = ({ projectId, isShowing, hide }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("backlog");
  const { currentUser } = useContext(AuthContext);
  const [owner, setOwner] = useState(currentUser);
  const [participants, setParticipants] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .onSnapshot((snapshot) => {
        if (snapshot.data()) {
          setOptions(
            snapshot.data().participants.map((participant) => ({
              label: participant.name,
              value: participant.uid,
            }))
          );
        }
      });
  }, [projectId]);

  const overrideStrings = {
    selectSomeItems: "Seleziona partecipanti...",
    allItemsAreSelected: "Hai selezionato tutti i partecipanti.",
    selectAll: "Seleziona tutti.",
    search: "Cerca...",
    clearSearch: "Cancella",
  };

  const createActivity = (e) => {
    e.preventDefault();
    if (name && description && status && participants) {
      db.collection("projects")
        .doc(projectId)
        .collection("activities")
        .add({
          owner: owner.uid,
          name,
          description,
          participants: participants.map((participant) => ({
            name: participant.label,
            uid: participant.value,
          })),
          status,
          timestamp: Timestamp,
        })
        .then((docRef) => {
          participants.forEach((participant) => {
            db.collection("users")
              .where("uid", "==", participant.value)
              .onSnapshot((snap) =>
                snap.docs.forEach((user) => {
                  let dbRef = db
                    .collection("users")
                    .doc(user.id)
                    .collection("notifications")
                    .doc();
                  if (user.data().uid !== currentUser.uid) {
                    dbRef.set({
                      type: 1,
                      message: `Sei stato(a) aggiunto(a) all'attività ${name}.`,
                      notificationRef: dbRef.id,
                      projectRef: projectId,
                      ref: docRef.id,
                      timestamp: Timestamp,
                      status: 0,
                    });
                  }
                })
              );
          });
        });
    }
    hide();
    setName("");
    setParticipants("");
  };

  return isShowing ? (
    <div
      className="addActivityModalComponent"
      onClick={(e) => {
        if (e.target.className === "addActivityModalComponent") {
          hide();
        }
      }}
    >
      <div className="addActivityModalComponent__container">
        <div className="addActivityModalComponent__close">
          <Close onClick={hide} />{" "}
        </div>{" "}
        <div className="addActivityModalComponent__header">
          <h3> Aggiungi un 'attività</h3>{" "}
        </div>{" "}
        <div className="addActivityModalComponent__content">
          <form>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Inserisci il nome dell'attività"
              onChange={(e) => setName(e.currentTarget.value)}
            />{" "}
            <textarea
              name="description"
              value={description}
              placeholder="Inserisci una descrizione per l'attività"
              onChange={(e) => setDescription(e.currentTarget.value)}
            />{" "}
            <p> Seleziona i partecipanti all 'attività:</p>{" "}
            <MultiSelect
              overrideStrings={overrideStrings}
              options={options}
              value={participants}
              onChange={setParticipants}
              labelledBy={"Seleziona i partecipanti"}
            />{" "}
            <p> Status dell 'attività:</p>{" "}
            <select
              value={status}
              onChange={(e) => setStatus(e.currentTarget.value)}
            >
              <option value="backlog"> BACKLOG </option>{" "}
              <option value="inProgress"> IN PROGRESSO </option>{" "}
              <option value="complete"> COMPLETATA </option>{" "}
            </select>{" "}
            <p> Creatore dell 'attività:</p>{" "}
            <input
              type="text"
              name="owner"
              value={owner.email}
              placeholder="Inserisci il nome dell'attività"
              disabled
              onChange={(e) => setOwner(e.currentTarget.value)}
            />{" "}
            <div
              className="addActivityModalComponent__btn"
              onClick={(e) => createActivity(e)}
            >
              Aggiungi{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  ) : null;
};

export default AddActivityModalComponent;
