import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/scss/style.scss";
import App from "./App";

import { BrowserRouter } from "react-router-dom";

// eslint-disable-next-line no-undef
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
