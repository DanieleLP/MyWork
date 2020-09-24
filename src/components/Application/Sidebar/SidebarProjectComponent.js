import React from "react";
import "./SidebarProjectComponent.css";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
const SidebarProjectComponent = (props) => {
  return (
    <div className="sidebarProjectComponent">
      <p>
        <ArrowRightIcon />
        {props.name}
      </p>
    </div>
  );
};

export default SidebarProjectComponent;
