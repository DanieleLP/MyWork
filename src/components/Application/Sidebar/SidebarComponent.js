import React, { useState, useEffect } from "react";
import "./SidebarComponent.css";
import firebaseApp, { db } from "../../../firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AppsIcon from "@material-ui/icons/Apps";
import AddIcon from "@material-ui/icons/Add";
import SidebarProjectComponent from "./SidebarProjectComponent";
import AddProjectModalComponent from "../Modal/AddProjectModalComponent";
import useModal from "../../../hooks/useModal";

const SidebarComponent = (props) => {
  const [projects, setProjects] = useState([]);
  const { show, toggle } = useModal();
  const uid = props.user.uid;

  useEffect(() => {
    db.collection("projects")
      .where("participants", "array-contains", uid)
      .get()
      .then((snapshot) => {
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
          <h3>
            <AppsIcon />I tuoi progetti
          </h3>
          {projects.map((project) => (
            <SidebarProjectComponent key={project.id} name={project.name} />
          ))}
          <div className="sidebarComponent__addProject" onClick={toggle}>
            <AddIcon />
          </div>
        </div>
      </div>
      <AddProjectModalComponent isShowing={show} hide={toggle} />
    </div>
  );
};

export default SidebarComponent;
