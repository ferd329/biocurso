import React from "react";

function Course({ params }) {
  const [curso, setCurso] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [progress, setProgress] = React.useState({});

  React.useEffect(() => {
    fetch(`/api/cursos/${params.params.slug}`)
      .then((res) => res.json())
      .then((data) => setCurso(data))
      .catch((err) => {
        console.error("Error loading course:", err);
      });
  }, [params.params.slug]);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("biocursos_session_v1");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  React.useEffect(() => {
    if (!user || !curso) return;
    const userProgress = user.progreso && user.progreso[curso.slug];
    if (userProgress) {
      setProgress(userProgress);
    }
  }, [user, curso.slug]);

  if (!curso) {
    return React.createElement(
      "section",
      { className: "p-4" },
      React.createElement("h1", { className: "text-3xl font-bold text-blue-900" }, "Curso"),
      React.createElement(
        "p",
        { className: "text-gray-600" },
        "Curso no encontrado"
      )
    );
  }

  const hasPurchased = user?.cursos_comprados && user.cursos_comprados.includes(curso.slug);

  return React.createElement(
    "section",
    { className: "p-4 max-w-2xl mx-auto" },
    React.createElement(
      "h1",
      { className: "text-3xl font-bold text-blue-900 mb-6" },
      curso.titulo
    ),

    hasPurchased
      ? null
      : React.createElement(
        "div",
        { className: "border rounded-lg p-4 mb-6 bg-blue-100" },
        React.createElement(
          "p",
          { className: "text-blue-700 font-medium mb-3" },
          "Compra requerida: Accede a este curso adquiriéndolo individually o suscribiéndote a un plan."
        ),
        React.createElement(
          "button",
          {
            className: `bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors w-full shadow-lg shadow-blue-500/20`,
            onClick: () => {
              if (!user) {
                window.location.hash = "#/login";
                return;
              }
              fetch("/api/cart", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.jwtToken}`,
                },
                body: JSON.stringify({ courseSlug: curso.slug }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.success) {
                    alert("Curso añadido al carrito: " + curso.titulo);
                  } else {
                    alert(data.message || "Error al añadir al carrito");
                  }
                })
                .catch((err) =>
                  console.error("Error adding to cart:", err)
                );
            },
          },
            hasPurchased
              ? "Ya tienes este curso"
              : "Añadir al carrito $".concat(curso.precio_individual.toFixed(2))
        )
      ),

    !hasPurchased && user && Object.keys(progress).length > 0 ? React.createElement(
      "div",
      { className: "mt-6 p-4 bg-blue-50 rounded" },
      React.createElement("h3", { className: "text-sm font-medium text-blue-800 mb-2" }, "Progreso"),
      React.createElement("p", { className: "text-blue-600 text-sm" },
        "Lecciones completadas: ",
        progress.lecciones_completadas || 0,
        " de ",
        Object.keys(curso?.modulos || {}).length || 10
      )
    ) : null,

    React.createElement(
      "div",
      { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" },
      React.createElement(
        "div",
        { className: "text-gray-600" },
        React.createElement("p", null, curso.descripcion)
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-2 gap-4 text-sm" },
        React.createElement(
          "div",
          null,
          React.createElement("dt", { className: "font-semibold" }, "Área"),
          React.createElement("dd", null, curso.area)
        ),
        React.createElement(
          "div",
          null,
          React.createElement("dt", { className: "font-semibold" }, "Tema"),
          React.createElement("dd", null, curso.tema)
        ),
        React.createElement(
          "div",
          null,
          React.createElement("dt", { className: "font-semibold" }, "Nivel"),
          React.createElement("dd", null, curso.nivel_educativo)
        ),
        React.createElement(
          "div",
          null,
          React.createElement("dt", { className: "font-semibold" }, "Formato"),
          React.createElement("dd", null, curso.formato)
        ),
        React.createElement(
          "div",
          null,
          React.createElement("dt", { className: "font-semibold" }, "Precio"),
          React.createElement("dd", null, `$${curso.precio_individual}`)
        )
      )
    )
  );
}

// Export default para router
export default function Curso({ params }) {
  return React.createElement(React.createElement("div", null), null); // placeholder
}

// Export named for router
export { Course };