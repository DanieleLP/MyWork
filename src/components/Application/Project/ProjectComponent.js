import React from "react";
import "./ProjectComponent.css";
import { useParams } from "react-router-dom";

const ProjectComponent = () => {
  const { projectId } = useParams();

  return (
    <div className="projectComponent">
      <div className="projectComponent__container">
        <p>Welcome to the {projectId} project</p>
      </div>
    </div>
  );
};

export default ProjectComponent;
