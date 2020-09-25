import React, { useEffect, useState } from "react";
import "./ProjectComponent.css";
import { useParams } from "react-router-dom";
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
            ...activity.data(),
          }))
        );
      });
  }, [projectId]);

  console.log(project.participants);
  console.log(activities);
  return (
    <div className="projectComponent">
      <div className="projectComponent__container">
        <h2>
          <span className="projectComponent__heading-nb">Progetto </span>
          {project.name}
        </h2>
        <p>
          Partecipanti:
          {project.participants &&
            project.participants.map((participant, i, arr) => (
              <span
                key={participant.uid}
                className="projectComponent__participants"
              >
                {" "}
                {participant.name}
                {!i && arr.length !== 1 ? "," : ""}
              </span>
            ))}
        </p>
        <div className="projectComponent__activities">
          <h4>Attività in "BACKLOG"</h4>
          <hr />
          <div className="projectComponent__activities-backlog">
            {activities !== "" &&
              activities
                .filter((activity) => activity.status === "backlog")
                .map((activity) => (
                  <ProjectActivityComponent
                    status={activity.status}
                    name={activity.name}
                    description={activity.description}
                    timestamp={activity.timestamp}
                  />
                ))}
            {activities.length === 0 && (
              <p>Non ci sono al momento attività registrate</p>
            )}
          </div>
          <h4>Attività "IN PROGRESS"</h4>
          <hr />
          <div className="projectComponent__activities-inProgress">
            {activities !== "" &&
              activities
                .filter((activity) => activity.status === "inProgress")
                .map((activity) => (
                  <ProjectActivityComponent
                    status={activity.status}
                    name={activity.name}
                    description={activity.description}
                    timestamp={activity.timestamp}
                  />
                ))}
            {activities.length === 0 && (
              <p>Non ci sono al momento attività registrate</p>
            )}
          </div>
          <h4>Attività "COMPLETATE"</h4>
          <hr />
          <div className="projectComponent__activities-complete">
            {activities !== "" &&
              activities
                .filter((activity) => activity.status === "complete")
                .map((activity) => (
                  <ProjectActivityComponent
                    status={activity.status}
                    name={activity.name}
                    description={activity.description}
                    timestamp={activity.timestamp}
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
