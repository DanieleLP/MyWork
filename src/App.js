import React, { useContext } from "react";
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";
import { AuthContext } from "./providers/Auth";
import SidebarComponent from "./components/Application/Sidebar/SidebarComponent";
import ProjectComponent from "./components/Application/Project/ProjectComponent";
import ActivityComponent from "./components/Application/Activity/ActivityComponent";
import LoginComponent from "./components/Auth/LoginComponent";
import RegisterComponent from "./components/Auth/RegisterComponent";
import ErrorComponent from "./components/Application/Error/ErrorComponent";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? (
    <div className="App">
      <SidebarComponent user={currentUser} />
      <Switch>
        <Route exact path="/projects/:projectId">
          <ProjectComponent />
        </Route>
        <Route exact path="/projects/:projectId/activity/:activityId">
          <ActivityComponent />
        </Route>
        <Route exact path="/error">
          <ErrorComponent />
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
