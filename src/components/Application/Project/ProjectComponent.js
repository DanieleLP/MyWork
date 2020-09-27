import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db } from "../../../firebase";
import { AuthContext } from "../../../providers/Auth";
import useModal from "../../../hooks/useModal";
import "./ProjectComponent.css";

import AddIcon from "@material-ui/icons/Add";
import ProjectActivityComponent from "./ProjectActivityComponent";
import AddActivityModalComponent from "../Modal/AddActivityModalComponent";

const ProjectComponent = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [activities, setActivities] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { show, toggle } = useModal();
  const history = useHistory();

  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .get()
      .then((projects) => {
        projects.data() &&
        projects
          .data()
          .participants.some(
            (participant) => participant.uid === currentUser.uid
          )
          ? setProject(projects.data())
          : history.push("/error");
      });
    db.collection("projects")
      .doc(projectId)
      .collection("activities")
      .onSnapshot((act) => {
        setActivities(
          act.docs.map((activity) => ({
            id: activity.id,
            ...activity.data(),
          }))
        );
      });
  }, [projectId, history, currentUser]);

  return (
    project && (
      <div className="projectComponent">
        <div className="projectComponent__container">
          <h2 className="projectComponent__heading">
            <span className="projectComponent__heading-nb">Progetto </span>
            {project.name}
          </h2>
          <p className="projectComponent__participants">
            Partecipanti:
            {project.participants &&
              project.participants.map((participant, i, arr) => (
                <span
                  key={participant.uid}
                  className="projectComponent__participants-b"
                >
                  {" "}
                  {participant.name}
                  {!i && arr.length !== 1 ? "," : ""}
                </span>
              ))}
          </p>
          <div className="projectComponent__activities">
            <h3>Attività in "BACKLOG"</h3>
            <hr />
            <div className="projectComponent__activities-backlog">
              {activities !== "" &&
                activities
                  .filter((activity) => activity.status === "backlog")
                  .map((activity) => (
                    <ProjectActivityComponent
                      key={activity.id}
                      activity={activity}
                    />
                  ))}
              {activities.length === 0 && (
                <p>Non ci sono al momento attività registrate</p>
              )}
            </div>
            <h3>Attività "IN PROGRESS"</h3>
            <hr />
            <div className="projectComponent__activities-inProgress">
              {activities !== "" &&
                activities
                  .filter((activity) => activity.status === "inProgress")
                  .map((activity) => (
                    <ProjectActivityComponent
                      key={activity.id}
                      activity={activity}
                    />
                  ))}
              {activities.length === 0 && (
                <p>Non ci sono al momento attività registrate</p>
              )}
            </div>
            <h3>Attività "COMPLETATE"</h3>
            <hr />
            <div className="projectComponent__activities-complete">
              {activities !== "" &&
                activities
                  .filter((activity) => activity.status === "complete")
                  .map((activity) => (
                    <ProjectActivityComponent
                      key={activity.id}
                      activity={activity}
                    />
                  ))}
              {activities.length === 0 && (
                <p>Non ci sono al momento attività registrate</p>
              )}
            </div>
          </div>
          <div className="projectComponent__activityFab" onClick={toggle}>
            <AddIcon />
          </div>
        </div>
        <AddActivityModalComponent
          projectId={projectId}
          isShowing={show}
          hide={toggle}
        />
      </div>
    )
  );
};

export default ProjectComponent;
