import React, { useContext } from "react";
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";
import { AuthContext } from "./providers/Auth";
import SidebarComponent from "./components/Application/Sidebar/SidebarComponent";
import LoginComponent from "./components/Auth/LoginComponent";
import RegisterComponent from "./components/Auth/RegisterComponent";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return currentUser ? (
    <div className="App">
      <SidebarComponent user={currentUser} />
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
