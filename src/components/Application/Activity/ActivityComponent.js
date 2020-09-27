/* 
  ActivityComponent
  component per i dettagli specifici di una attività;
  fornisce le funzionalità di aggiornamento dell'attività;
  fornisce le funzionalità di AGGIUNTA di un aggiornamento nello sviluppo dell'attività.
*/

import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { db, Timestamp } from "../../../firebase";
import { AuthContext } from "../../../providers/Auth";
import "./ActivityComponent.css";

import MultiSelect from "react-multi-select-component";
import ActivityUpdateComponent from "./ActivityUpdateComponent";
import ActivityChatComponent from "./ActivityChatComponent";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

const ActivityComponent = () => {
  const { projectId, activityId } = useParams();
  const [activity, setActivity] = useState({});
  const [options, setOptions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState("");
  const [hours, setHours] = useState("");
  const [totHours, setTotHours] = useState(0);
  const [desc, setDesc] = useState("");
  const [updates, setUpdates] = useState("");
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  // fetch real-time dei dati dell'attività e popolazione degli stati (attività, partecipanti, status)
  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .collection("activities")
      .doc(activityId)
      .onSnapshot((act) => {
        if (act.data()) {
          setActivity(act.data());
          setParticipants(
            act.data().participants.map((participant) => ({
              label: participant.name,
              value: participant.uid,
            }))
          );
          setStatus(act.data().status);
        } else {
          history.push("/error");
        }
      });
  }, [projectId, activityId, currentUser, history]);

  // fetch real-time di tutti i partecipanti al progetto a cui appartiene l'attività
  // utile per eventuale aggiunta di nuovi partecipanti all'attività
  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .onSnapshot((proj) => {
        proj.data()
          ? setOptions(
              proj.data().participants.map((participant) => ({
                label: participant.name,
                value: participant.uid,
              }))
            )
          : history.push("/error");
      });
  }, [projectId, history]);

  // fetch real-time di tutti gli update di una attività in ordine di tempo decrescente
  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .collection("activities")
      .doc(activityId)
      .collection("updates")
      .orderBy("timestamp", "desc")
      .onSnapshot((upd) => {
        setUpdates(upd.docs.map((up) => up.data()));
        setTotHours(upd.docs.reduce((a, b) => a + (b.data().hours || 0), 0));
      });
  }, [projectId, activityId]);

  // funzione per l'aggiornamento di una attività (status, partecipanti)
  // invio della notifica di aggiornamento a tutti gli utenti partecipanti all'attività
  const update = (e) => {
    if (participants && status) {
      const updParticipants = participants.map((participant) => ({
        name: participant.label,
        uid: participant.value,
      }));

      db.collection("projects")
        .doc(projectId)
        .collection("activities")
        .doc(activityId)
        .update({ participants: updParticipants, status: status })
        .then((updRef) => {
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
                                type: 4,
                                message: `${user.data().name} ${
                                  user.data().lastName
                                } ha aggiornato lo stato di ${activity.name}.`,
                                notificationRef: dbRef.id,
                                projectRef: projectId,
                                activityRef: activityId,
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
    }
  };

  // funzione per l'aggiunta di un aggiornamento di sviluppo dell'attività
  // invio della notifica a tutti gli utenti partecipanti all'attività
  const addUpdate = (e) => {
    e.preventDefault();
    if (desc !== "" && hours !== "") {
      db.collection("projects")
        .doc(projectId)
        .collection("activities")
        .doc(activityId)
        .collection("updates")
        .add({
          user: currentUser.uid,
          description: desc,
          hours: parseFloat(hours),
          timestamp: Timestamp,
        })
        .then((updRef) => {
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
                                type: 3,
                                message: `${user.data().name} ${
                                  user.data().lastName
                                } ha lavorato a ${activity.name}.`,
                                notificationRef: dbRef.id,
                                projectRef: projectId,
                                activityRef: activityId,
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
      setHours("");
      setDesc("");
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
          Partecipanti:{" "}
          {activity.participants &&
            activity.participants.map((participant, i, arr) => (
              <span
                key={participant.uid}
                className="activityComponent__participants-b"
              >
                {activity.participants.length > 1
                  ? i !== activity.participants.length - 1
                    ? (i ? ", " : "") + participant.name
                    : " e " + participant.name
                  : null}
                {activity.participants.length < 2 && participant.name}
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
        <div className="activityComponent__interaction">
          <div className="activityComponent__chat">
            <p>Commenti:</p>
            <div className="activityComponent__chat-container">
              <ActivityChatComponent />
            </div>
          </div>
          <div className="activityComponent__updates">
            <p>Ultimi aggiornamenti:</p>
            <div className="activityComponent__updates-list">
              {updates !== "" &&
                updates.map((update) => (
                  <ActivityUpdateComponent
                    key={update.timestamp}
                    update={update}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityComponent;
