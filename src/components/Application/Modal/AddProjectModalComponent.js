import React, { useState, useEffect } from "react";
import MultiSelect from "react-multi-select-component";
import { db } from "../../../firebase";
import { Close } from "@material-ui/icons";
import "./AddProjectModalComponent.css";
const AddProjectModalComponent = ({ isShowing, hide }) => {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [options, setOptions] = useState({});
  const [error, setError] = useState("");

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
      db.collection("projects").add({
        name,
        participants: participants.map((participant) => participant.value),
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
          <h3>Aggiungi un progetto</h3>
          <span className="addProjectModalComponent__error">{error}</span>
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
            <p>Seleziona i partecipanti:</p>
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
