import React from "react";
import "./ProjectActivityComponent.css";

const ProjectActivityComponent = (props) => {
  let ts = props.timestamp
    ? new Date(props.timestamp.seconds * 1000).toLocaleString()
    : null;

  return (
    <div className={`projectActivityComponent ${props.status}`}>
      <h4 className="projectActivityComponent__title">{props.name}</h4>
      <span className="projectActivityComponent__description">
        {props.description}
      </span>
      <span className="projectActivityComponent__timestamp">{ts}</span>
    </div>
  );
};

export default ProjectActivityComponent;
