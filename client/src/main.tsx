import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import "./index.css";

const faviconHref = new URL("../assets/DBS-Bank-Logo-1.svg", import.meta.url)
  .href;

const existingFavicon = document.querySelector<HTMLLinkElement>(
  'link[rel="icon"]'
);

if (existingFavicon) {
  existingFavicon.href = faviconHref;
} else {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = faviconHref;
  document.head.appendChild(link);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
