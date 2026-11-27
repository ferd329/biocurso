import React from "react";

function Admin() {
  const [users, setUsers] = React.useState([]);
  const [token] = React.useState(
    typeof window !== "undefined" ? window.sessionStorage.getItem("jwtToken") : null
  );

  React.useEffect(() => {
    if (!token) {
      setUsers([]);
      return;
    }
    fetch("/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => {});
  }, [token]);

  const handleDelete = async (userId) => {
    if (!confirm("¿Eliminar usuario?")) return;
    await fetch(`/api/usuarios/${userId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setUsers(users.filter((u) => u.id !== userId));
  };

  const bluePrimary = "bg-blue-600";
  const blueHover = "bg-blue-700";
  const blueLight = "bg-blue-100";
  const borderBlue = "border-blue-200";

  if (!token) {
    return React.createElement("section", {
      className: "p-4 text-center",
    },
      React.createElement("h1", { className: "text-3xl font-bold text-blue-900 mb-4" }, "Panel de Administración"),
      React.createElement("p", { className: "text-gray-600" },
        "Por favor inicia sesión para acceder al panel"
      ),
      React.createElement("a", {
        href: "#/login",
        className: ` ${bluePrimary} text-white font-medium py-2 px-4 rounded hover:${blueHover} transition-colors shadow-lg shadow-blue-500/20`,
      }, "Iniciar sesión")
    );
  }

  return React.createElement("section", {
    className: "p-4",
  },
    React.createElement("h1", { className: "text-3xl font-bold text-blue-900 mb-6" }, "Panel de Administración"),
    
    React.createElement("div", {
      className: "grid grid-cols-2 gap-4 mb-6",
    },
      React.createElement("div", {
        className: `bg-blue-50 rounded-lg p-4 border border-${borderBlue}`,
      },
        React.createElement("h3", { className: "text-sm font-medium text-blue-900 mb-2" }, "Usuarios totales"),
        React.createElement("p", { className: "text-3xl font-bold text-blue-900" }, users.length)
      )
    ),

    React.createElement("div", {
      className: "overflow-x-auto",
    },
      React.createElement("table", {
        className: "min-w-full rounded-lg overflow-hidden",
      },
        React.createElement("thead", {
          className: "bg-blue-50",
        },
          React.createElement("tr", null,
            React.createElement("th", { className: "text-left p-4 text-xs font-medium text-blue-600 uppercase tracking-wider" }, "ID"),
            React.createElement("th", { className: "text-left p-4 text-xs font-medium text-blue-600 uppercase tracking-wider" }, "Nombre"),
            React.createElement("th", { className: "text-left p-4 text-xs font-medium text-blue-600 uppercase tracking-wider" }, "Email")
          )
        ),
        React.createElement("tbody",
          users.length === 0 && React.createElement("tr", { className: "p-4 text-center text-gray-500" },
            "No hay usuarios registrados"
          ) || users.map((user) =>
            React.createElement("tr", { key: user.id, className: "border-y bg-blue-50/50" },
              React.createElement("td", { className: "p-4 text-sm text-blue-900" }, user.id),
              React.createElement("td", { className: "p-4 text-sm text-blue-900" }, user.nombre),
              React.createElement("td", { className: "p-4 text-sm text-blue-900" }, user.email),
              React.createElement("td", { className: "p-4 text-sm" },
                React.createElement("button", {
                  onClick: () => handleDelete(user.id),
                  className: "text-sm text-blue-500 hover:text-blue-700 underline me-2",
                }, "Eliminar"),
                React.createElement("button", {
                  onClick: () => window.location.hash = "#/admin",
                  className: "text-sm text-blue-500 hover:text-blue-700 underline",
                }, "Ver detalle")
              )
            )
          )
        )
      )
    )
  );
}

export default Admin;