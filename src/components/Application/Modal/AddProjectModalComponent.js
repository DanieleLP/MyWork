import React, { useState, useEffect, useContext } from "react";
import { db, Timestamp } from "../../../firebase";
import { AuthContext } from "../../../providers/Auth";
import "./AddProjectModalComponent.css";

import MultiSelect from "react-multi-select-component";
import { Close } from "@material-ui/icons";

const AddProjectModalComponent = ({ isShowing, hide }) => {
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      setOptions(
        snapshot.docs.map((doc) => ({
          label: `${doc.data().name} ${doc.data().lastName}`,
          value: doc.data().uid,
        }))
      );
    });
  }, []);

  const overrideStrings = {
    selectSomeItems: "Seleziona partecipanti...",
    allItemsAreSelected: "Hai selezionato tutti i partecipanti.",
    selectAll: "Seleziona tutti.",
    search: "Cerca...",
    clearSearch: "Cancella",
  };

  const createProject = (e) => {
    e.preventDefault();
    if (name) {
      db.collection("projects")
        .add({
          name,
          participants: participants.map((participant) => ({
            name: participant.label,
            uid: participant.value,
          })),
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
                      type: 0,
                      message: `Sei stato(a) aggiunto(a) al progetto ${name}.`,
                      notificationRef: dbRef.id,
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
      className="addProjectModalComponent"
      onClick={(e) => {
        if (e.target.className === "addProjectModalComponent") {
          hide();
        }
      }}
    >
      <div className="addProjectModalComponent__container">
        <div className="addProjectModalComponent__close">
          <Close onClick={hide} />
        </div>
        <div className="addProjectModalComponent__header">
          <h3> Aggiungi un progetto </h3>
        </div>
        <div className="addProjectModalComponent__content">
          <form>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Inserisci il nome del progetto"
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <p> Seleziona i partecipanti: </p>
            <MultiSelect
              overrideStrings={overrideStrings}
              options={options}
              value={participants}
              onChange={setParticipants}
              labelledBy={"Seleziona i partecipanti"}
            />
            <div
              className="addProjectModalComponent__btn"
              onClick={(e) => createProject(e)}
            >
              Aggiungi
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddProjectModalComponent;
