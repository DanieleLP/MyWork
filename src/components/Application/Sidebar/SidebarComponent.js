/* 
  SidebarComponent
  component per l'intera sidebar, contentente le funzionalità della piattaforma
*/
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import firebaseApp, { db } from "../../../firebase";
import useModal from "../../../hooks/useModal";
import "./SidebarComponent.css";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AppsIcon from "@material-ui/icons/Apps";
import AddIcon from "@material-ui/icons/Add";
import SidebarProjectComponent from "./SidebarProjectComponent";
import AddProjectModalComponent from "../Modal/AddProjectModalComponent";

const SidebarComponent = (props) => {
  const [projects, setProjects] = useState([]);
  const { show, toggle } = useModal();
  const history = useHistory();
  const [notifications, setNotifications] = useState([]);

  // fetch real-time dell'utente e delle notifiche non lette
  useEffect(() => {
    const uid = props.user.currentUser.uid;
    db.collection("users")
      .where("uid", "==", uid)
      .onSnapshot((snap) =>
        snap.docs.map((user) =>
          db
            .collection("users")
            .doc(user.id)
            .collection("notifications")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
              setNotifications(
                snapshot.docs.filter((snap) => snap.data().status === 0)
              )
            )
        )
      );
  }, [props]);

  // fetch real-time dei progetti dell'utente attuale
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
            <div className="sidebarComponent__notification">
              <NotificationsIcon
                onClick={() =>
                  history.push(`/notifications/${props.user.currentUser.uid}`)
                }
              />
              {notifications && notifications.length > 0 ? (
                <span className="sidebarComponent__notification-badge animated">
                  {notifications.length}
                </span>
              ) : null}
            </div>
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
