import React from "react";
import "./ProjectActivityComponent.css";

const ProjectActivityComponent = (props) => {
  return (
    <div className={`projectActivityComponent ${props.status}`}>
      {props.title}
    </div>
  );
};

export default ProjectActivityComponent;
