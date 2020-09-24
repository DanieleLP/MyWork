import React from "react";
import "./SidebarProjectComponent.css";
const SidebarProjectComponent = (props) => {
  return (
    <div className="sidebarProjectComponent">
      <p>{props.name}</p>
    </div>
  );
};

export default SidebarProjectComponent;
