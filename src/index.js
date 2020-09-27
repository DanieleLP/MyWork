/* 
  entry point per l'app
*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/Auth";
import "./index.css";

import App from "./App";

// set del tema di base a "default" se non è settato nel localstorage
document.body.classList.add(localStorage.getItem("theme") || "default");

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
