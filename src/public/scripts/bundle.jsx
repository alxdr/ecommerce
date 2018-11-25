import "regenerator-runtime";
import React from "react";
import { hydrate } from "react-dom";
import Home from "../../views/home";

hydrate(<Home />, document.getElementById("root"));
