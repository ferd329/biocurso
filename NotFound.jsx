import React from "react";

function NotFound() {
  return React.createElement("section", {
    className: "p-4 text-center bg-blue-50",
  },
    React.createElement("h1", {
      className: "text-4xl font-bold text-blue-900",
    }, "404"),
    React.createElement("p", {
      className: "text-gray-600",
    }, "La página que buscas no existe.")
  );
}

export default function NotFound() {
  return React.createElement("div", null, null);
}