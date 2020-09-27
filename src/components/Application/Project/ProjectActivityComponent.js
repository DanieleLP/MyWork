/* 
  ProjectActivityComponent
  component per la preview di una attività nella pagina dei progetti
*/
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./ProjectActivityComponent.css";

const ProjectActivityComponent = (props) => {
  const { id, name, description, status, timestamp } = props.activity;
  const history = useHistory();
  const location = useLocation();

  let ts = timestamp
    ? new Date(timestamp.seconds * 1000).toLocaleString()
    : null;

  return (
    <div
      className={`projectActivityComponent ${status}`}
      onClick={(e) => history.push(`${location.pathname}/activity/${id}`)}
    >
      <h4 className="projectActivityComponent__title">{name}</h4>
      <span className="projectActivityComponent__description">
        {description}
      </span>
      <span className="projectActivityComponent__timestamp">{ts}</span>
    </div>
  );
};

export default ProjectActivityComponent;
