import React, { useContext } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import { AuthContext } from "./providers/Auth";
import firebaseApp from "./firebase";
import LoginComponent from "./components/Auth/LoginComponent";
import RegisterComponent from "./components/Auth/RegisterComponent";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? (
    <>
      <h1>Home</h1>
      <button onClick={() => firebaseApp.auth().signOut()}>Sign out</button>
    </>
  ) : (
    <div className="App">
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
