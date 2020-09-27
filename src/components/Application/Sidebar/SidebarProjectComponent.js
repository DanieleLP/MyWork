import React from "react";
import { useHistory } from "react-router-dom";
import "./SidebarProjectComponent.css";

import ArrowRightIcon from "@material-ui/icons/ArrowRight";

const SidebarProjectComponent = (props) => {
  const history = useHistory();

  const selectProject = () => {
    if (props.id) {
      history.push(`/projects/${props.id}`);
    } else {
      history.push(`/projects/${props.name}`);
    }
  };

  return (
    <div className="sidebarProjectComponent" onClick={selectProject}>
      <p>
        <ArrowRightIcon />
        {props.name}
      </p>
    </div>
  );
};

export default SidebarProjectComponent;
