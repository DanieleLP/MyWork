/* 
  App
  component principale per la piattaforma
  funzionalità di routing --> visualizzazione dei componenti
*/
import React, { useContext, useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { db } from "./firebase";
import { AuthContext } from "./providers/Auth";
import "./App.css";

import HomeComponent from "./components/Application/Home/HomeComponent";
import SidebarComponent from "./components/Application/Sidebar/SidebarComponent";
import ProjectComponent from "./components/Application/Project/ProjectComponent";
import ActivityComponent from "./components/Application/Activity/ActivityComponent";
import LoginComponent from "./components/Auth/LoginComponent";
import RegisterComponent from "./components/Auth/RegisterComponent";
import ErrorComponent from "./components/Application/Error/ErrorComponent";
import NotificationsComponent from "./components/Application/Notifications/NotificationsComponent";
import SettingsComponent from "./components/Application/Settings/SettingsComponent";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [toggled, setToggled] = useState(false);

  // se si chiude il browser/tab effettua il logout
  // window.addEventListener("beforeunload", (e) => {
  //   firebaseApp.auth().signOut();
  // });

  // fetch real-time dei dati dell'utente attuale
  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .where("uid", "==", currentUser.uid)
        .onSnapshot((snap) =>
          snap.docs.map((user) =>
            setName(`${user.data().name} ${user.data().lastName}`)
          )
        );
    }
  }, [currentUser]);

  const toggleMenu = (e) => {
    console.log("hello");
    setToggled((prev) => !prev);
  };

  return currentUser ? (
    <div className="App">
      <SidebarComponent
        toggled={{ toggled, toggleMenu }}
        user={{ name, currentUser }}
      />
      <div
        className={`sidebarComponent__toggler ${toggled ? "shown" : null}`}
        onClick={(e) => toggleMenu(e)}
      >
        <MenuOpenIcon />
      </div>
      <Switch>
        <Route exact path="/projects/:projectId/activity/:activityId">
          <ActivityComponent />
        </Route>
        <Route exact path="/projects/:projectId">
          <ProjectComponent />
        </Route>
        <Route exact path="/notifications/:userUid">
          <NotificationsComponent />
        </Route>
        <Route exact path="/settings/:userUid">
          <SettingsComponent />
        </Route>
        <Route exact path="/error">
          <ErrorComponent />
        </Route>
        <Route exact path="/">
          <HomeComponent />
        </Route>
        <Route exact path="*">
          <Redirect to="/error" />
        </Route>
      </Switch>
    </div>
  ) : (
    <div className="App">
      <Redirect to="/login" />
      <Switch>
        <Route exact path="/login">
          <LoginComponent />
        </Route>
        <Route exact path="/register">
          <RegisterComponent />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
