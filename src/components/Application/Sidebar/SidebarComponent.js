import React, { useState, useEffect } from "react";
import "./SidebarComponent.css";
import firebaseApp, { db } from "../../../firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SidebarProjectComponent from "./SidebarProjectComponent";

const SidebarComponent = (props) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    db.collection("projects").onSnapshot((snapshot) => {
      setProjects(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
      );
    });
  }, []);
  return (
    <div className="sidebarComponent">
      <div className="sidebarComponent__container">
        <div className="sidebarComponent__header">
          <h2>MyWork</h2>
          <p>{props.user.email}</p>
          <div className="sidebarComponent__header-addons">
            <NotificationsIcon />
            <SettingsIcon />
            <ExitToAppIcon onClick={() => firebaseApp.auth().signOut()} />
          </div>
        </div>
        <div className="sidebarComponent__projects">
          <h3>I tuoi progetti</h3>
          {projects.map((project) => (
            <SidebarProjectComponent name={project.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
