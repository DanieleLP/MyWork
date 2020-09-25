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
  const { show, toggle } = useModal();

  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .get()
      .then((project) => {
        setProject(project.data());
      });
  }, [projectId]);

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
          <div className="projectComponent__activities-backlog">
            <ProjectActivityComponent
              status="backlog"
              title="Attività in stato 'BACKLOG'"
            />
          </div>
          <div className="projectComponent__activities-inProgress">
            <ProjectActivityComponent
              status="inProgress"
              title="Attività in stato 'IN PROGRESSO'"
            />
          </div>
          <div className="projectComponent__activities-complete">
            <ProjectActivityComponent
              status="complete"
              title="Attività in stato 'COMPLETATA'"
            />
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
