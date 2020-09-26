import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import MultiSelect from "react-multi-select-component";
import { db, Timestamp } from "../../../firebase";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../providers/Auth";

import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import "./ActivityComponent.css";

const ActivityComponent = () => {
  const { projectId, activityId } = useParams();
  const [activity, setActivity] = useState({});
  const [options, setOptions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState("");
  const [hours, setHours] = useState("");
  const [totHours, setTotHours] = useState(2);
  const [desc, setDesc] = useState("");
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .collection("activities")
      .doc(activityId)
      .onSnapshot((act) => {
        setActivity(act.data());
        setParticipants(
          act.data().participants.map((participant) => ({
            label: participant.name,
            value: participant.uid,
          }))
        );
        setStatus(act.data().status);
      });
  }, [projectId, activityId]);

  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .onSnapshot((proj) => {
        setOptions(
          proj.data().participants.map((participant) => ({
            label: participant.name,
            value: participant.uid,
          }))
        );
      });
  }, [projectId]);

  const update = (e) => {
    console.log("faccio update");
  };

  const addUpdate = (e) => {
    if (desc !== "" && hours !== "") {
      db.collection("projects")
        .doc(projectId)
        .collection("activities")
        .doc(activityId)
        .collection("updates")
        .add({
          user: currentUser.uid,
          description: desc,
          hours: hours,
          timestamp: Timestamp,
        });
    }
  };

  const overrideStrings = {
    selectSomeItems: "Seleziona partecipanti...",
    allItemsAreSelected: "Hai selezionato tutti i partecipanti.",
    selectAll: "Seleziona tutti.",
    search: "Cerca...",
    clearSearch: "Cancella",
  };

  return (
    <div className="activityComponent">
      <div className="activityComponent__container">
        <div
          className="activityComponent__backBtn"
          onClick={(e) => history.goBack()}
        >
          <KeyboardBackspaceIcon />
        </div>
        <h2 className="activityComponent__heading">
          <span className="activityComponent__heading-nb">Attività </span>
          <span className="activityComponent__heading-up">
            {activity.name}
          </span>{" "}
          <span className="activityComponent__heading-mt">
            ({activity.status})
          </span>
        </h2>
        <p className="activityComponent__participants">
          Partecipanti:
          {activity.participants &&
            activity.participants.map((participant, i, arr) => (
              <span
                key={participant.uid}
                className="activityComponent__participants-b"
              >
                {" "}
                {participant.name}
                {!i && arr.length !== 1 ? "," : ""}
              </span>
            ))}
        </p>
        <p className="activityComponent__description">{activity.description}</p>
        <hr />
        <div className="activityComponent__content">
          <div className="activityComponent__info">
            <div className="activityComponent__info-el">
              <p>Ore di lavoro totali:</p>
              <h2>{totHours}h</h2>
            </div>
            <div className="activityComponent__info-el">
              <p>Partecipanti attuali:</p>
              <MultiSelect
                overrideStrings={overrideStrings}
                options={options}
                value={participants}
                onChange={setParticipants}
                labelledBy={"Seleziona i partecipanti"}
              />
            </div>
            <div className="activityComponent__info-el">
              <p>Status attuale dell'attività:</p>
              <select
                value={status}
                onChange={(e) => setStatus(e.currentTarget.value)}
              >
                <option value="backlog">BACKLOG</option>
                <option value="inProgress">IN PROGRESSO</option>
                <option value="complete">COMPLETATA</option>
              </select>
            </div>
            <div className="activityComponent__info-el">
              <div
                className="activityComponent__info-updBtn"
                onClick={(e) => update(e)}
              >
                Aggiorna
              </div>
            </div>
          </div>
          <div className="activityComponent__update">
            <div className="activityComponent__update-el">
              <p>Aggiungi ore di lavoro:</p>
              <input
                type="number"
                name="hours"
                value={hours}
                min="0"
                step=".10"
                onChange={(e) => {
                  setHours(e.currentTarget.value);
                }}
              />
            </div>
            <div className="activityComponent__update-el">
              <p>Descrizione lavoro: </p>
              <textarea
                type="text"
                name="desc"
                value={desc}
                onChange={(e) => {
                  setDesc(e.currentTarget.value);
                }}
              />
            </div>
            <div className="activityComponent__update-el">
              <div
                className="activityComponent__update-updBtn"
                onClick={(e) => addUpdate(e)}
              >
                Aggiungi
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default ActivityComponent;
