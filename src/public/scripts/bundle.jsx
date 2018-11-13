import "@babel/polyfill";
import React from "react";
import { hydrate } from "react-dom";
import Home from "../../views/home";

hydrate(<Home />, document.getElementById("root"));
