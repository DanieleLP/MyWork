import React, { useEffect, useContext, useState } from "react";
import "./ProjectComponent.css";
import { useParams, useHistory } from "react-router-dom";
import { AuthContext } from "../../../providers/Auth";
import { db } from "../../../firebase";
import AddIcon from "@material-ui/icons/Add";
import ProjectActivityComponent from "./ProjectActivityComponent";

const ProjectComponent = () => {
  const { currentUser } = useContext(AuthContext);
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const history = useHistory();

  useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .onSnapshot((snapshot) => {
        if (!snapshot || snapshot === undefined) {
          history.push("/error");
        } else if (
          snapshot.data() === undefined ||
          !snapshot.data().participants.includes(currentUser.uid)
        ) {
          history.push("/error");
        } else {
          setProject(snapshot.data());
        }
      });
  }, [currentUser.uid, history, projectId]);
  console.log(project);

  return (
    <div className="projectComponent">
      <div className="projectComponent__container">
        <h2>
          <span className="projectComponent__heading-nb">Progetto </span>
          {project.name}
        </h2>
        <p>
          Partecipanti:
          {project.participants}
        </p>
        <div className="projectComponent__activities">
          <ProjectActivityComponent
            status="backlog"
            title="Attività in stato 'BACKLOG'"
          />
          <ProjectActivityComponent
            status="inProgress"
            title="Attività in stato 'IN PROGRESSO'"
          />
          <ProjectActivityComponent
            status="complete"
            title="Attività in stato 'COMPLETATA'"
          />
        </div>
        <div className="projectComponent__activityFab">
          <AddIcon />
        </div>
      </div>
    </div>
  );
};

export default ProjectComponent;
