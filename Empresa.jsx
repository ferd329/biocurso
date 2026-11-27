import React from "react";

function Empresa() {
  return React.createElement("section", {
    className: "p-4 max-w-2xl mx-auto bg-blue-50",
  },
    React.createElement(
      "h1",
      { className: "text-3xl font-bold text-blue-900 mb-6" },
      "Portal de Empresas"
    ),
    React.createElement("p", {
      className: "text-gray-600 text-lg mb-6",
    },
      "Regístrate para obtener acceso empresarial a nuestros cursos y laboratorios."
    ),
    React.createElement("form", {
      className: "space-y-4",
    },
      React.createElement("div",
        null,
        React.createElement("label", {
          className: "block text-sm font-medium text-blue-700 mb-2",
        },
          "Nombre de la empresa"
        ),
        React.createElement("input", {
          type: "text",
          name: "empresa",
          className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600",
          required: true,
        })
      ),
      React.createElement("div",
        null,
        React.createElement("label", {
          className: "block text-sm font-medium text-blue-700 mb-2",
        },
          "Contacto"
        ),
        React.createElement("input", {
          type: "email",
          name: "contacto",
          className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600",
          required: true,
        })
      ),
      React.createElement("button", {
        type: "submit",
        className: `bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20`,
      },
        "Solicitar acceso empresarial"
      )
    )
  );
}

export default function Empresa() {
  return React.createElement("div", null, null);
}