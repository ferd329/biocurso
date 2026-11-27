import React from "react";

function Planes() {
  return React.createElement("section", {
    className: "p-4 max-w-4xl mx-auto bg-blue-50",
  },
    React.createElement(
      "h1",
      { className: "text-3xl font-bold text-blue-900 mb-6" },
      "Nuestros Planes"
    ),
    React.createElement(
      "div",
      { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
      React.createElement("div", {
        className: "border rounded-lg p-6 hover:bg-blue-100 transition-colors",
      },
        React.createElement("h3", { className: "text-xl font-medium text-blue-900 mb-4" }, "Plan Básico"),
        React.createElement("p", { className: "text-gray-600 mb-4" }, "$49.99/mes"),
        React.createElement("ul", { className: "space-y-2 text-sm" },
          React.createElement("li", null, "Acceso a todos los cursos"),
          React.createElement("li", null, "Material didáctico"),
          React.createElement("li", null, "Flashcards interactivos")
        )
      ),
      React.createElement("div", {
        className: "border rounded-lg p-6 hover:bg-blue-100 transition-colors",
      },
        React.createElement("h3", { className: "text-xl font-medium text-blue-900 mb-4" }, "Plan Pro"),
        React.createElement("p", { className: "text-gray-600 mb-4" }, "$499.99/año"),
        React.createElement("ul", { className: "space-y-2 text-sm" },
          React.createElement("li", null, "Todo lo Básico"),
          React.createElement("li", null, "Laboratorios virtuales"),
          React.createElement("li", null, "Prioridad en soporte")
        )
      )
    )
  );
}

export default function Planes() {
  return React.createElement("div", null, null);
}
export { Planes };