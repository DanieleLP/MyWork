import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
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
  const history = useHistory();

  useEffect(() => {
    const uid = props.user.currentUser.uid;
    db.collection("projects").onSnapshot((snapshot) => {
      setProjects(
        snapshot.docs
          .filter(function (projects) {
            return projects.data().participants.some(function (participant) {
              return participant.uid === uid;
            });
          })
          .map((project) => ({
            id: project.id,
            ...project.data(),
          }))
      );
    });
  }, [props]);

  return (
    <div className="sidebarComponent">
      <div className="sidebarComponent__container">
        <div className="sidebarComponent__header">
          <Link to="/">
            <h2>MyWork</h2>
          </Link>
          <p>
            {props.user.name}
            <br />
            <span className="sidebarComponent__header-email">
              ({props.user.currentUser.email})
            </span>
          </p>
          <div className="sidebarComponent__header-addons">
            <NotificationsIcon
              onClick={() =>
                history.push(`/notifications/${props.user.currentUser.uid}`)
              }
            />
            <SettingsIcon
              onClick={() =>
                history.push(`/settings/${props.user.currentUser.uid}`)
              }
            />
            <ExitToAppIcon onClick={() => firebaseApp.auth().signOut()} />
          </div>
        </div>
        <div className="sidebarComponent__projects">
          <h3>
            <AppsIcon />I tuoi progetti
          </h3>
          {projects.map((project) => (
            <SidebarProjectComponent
              key={project.id}
              id={project.id}
              name={project.name}
            />
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
