import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProjectComponent.css";
import { db } from "../../../firebase";
import AddIcon from "@material-ui/icons/Add";
import ProjectActivityComponent from "./ProjectActivityComponent";
import AddActivityModalComponent from "../Modal/AddActivityModalComponent";
import useModal from "../../../hooks/useModal";

const ProjectComponent = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [activities, setActivities] = useState("");

  const { show, toggle } = useModal();

  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .get()
      .then((projects) => {
        setProject(projects.data());
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
  }, [projectId]);

  return (
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
  );
};

export default ProjectComponent;
