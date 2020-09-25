import React from "react";
import "./ProjectActivityComponent.css";

const ProjectActivityComponent = (props) => {
  return (
    <div className={`projectActivityComponent ${props.status}`}>
      <h4>{props.title}</h4>
      <span>descrizione attività</span>
    </div>
  );
};

export default ProjectActivityComponent;
