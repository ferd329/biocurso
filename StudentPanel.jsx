import React from "react";

function StudentPanel() {
  // Obtener datos del usuario desde localStorage (sesión activa)
  const [user, setUser] = React.useState(null);
  const [cursos, setCursos] = React.useState([]);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("biocursos_session_v1");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  // Los cursos disponibles vienen de data.js (inyectado en index.html)
  React.useEffect(() => {
    if (window.BioCursosDatos && window.BioCursosDatos.cursos) {
      setCursos(window.BioCursosDatos.cursos);
    }
  }, []);

  // Si no hay usuario o datos, mostrar estado inicial
  if (!user) {
    return React.createElement("section", {
      className: "p-4 text-center text-gray-600",
    },
      React.createElement("h1", { className: "text-2xl font-bold text-blue-900 mb-4" }, "Panel de Estudiante"),
      React.createElement("p", null,
        "Inicia sesión para ver tu panel de progreso"
      ),
      React.createElement("a", {
        href: "#/login",
        className: "bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20",
      }, "Iniciar sesión")
    );
  }

  // Determinar los cursos comprados por este estudiante
  const cursosComprados = user.cursos_comprados || [];
  const progresoUsuario = user.progreso || {};

  // Estadísticas de flashcards y certificados
  const totalFlashcards = (user.flashcards || []).length;
  const certificados = user.certificados || [];
  const totalCertificados = certificados.length;

  // Calcular estadísticas generales por curso
  let totalLeccionesCompletadas = 0;
  let totalLeccionesTotales = 0;
  const progresoPorCurso = [];

  cursosComprados.forEach((courseSlug) => {
    const curso = cursos.find((c) => c.slug === courseSlug);
    if (!curso) return;

    const moduloData = curso.modulos || {};
    let leccionesDelCurso = 0;

    // Contar todas las lecciones del curso
    Object.values(moduloData).forEach((modulo) => {
      if (modulo.lecciones && Array.isArray(modulo.lecciones)) {
        leccionesDelCurso += modulo.lecciones.length;
      }
    });
    totalLeccionesTotales += leccionesDelCurso;

    // Contar lecciones completadas
    const progresoCurso = progresoUsuario[courseSlug];
    let completadas = 0;
    if (progresoCurso && progresoCurso.lecciones_completadas && Array.isArray(progresoCurso.lecciones_completadas)) {
      completadas = progresoCurso.lecciones_completadas.length;
    }
    totalLeccionesCompletadas += completadas;

    const porcentaje = leccionesDelCurso > 0 ? Math.round((completadas / leccionesDelCurso) * 100) : 0;

    progresoPorCurso.push({
      courseSlug,
      titulo: curso.titulo,
      progreso: completadas,
      total: leccionesDelCurso,
      porcentaje,
    });
  });

  // Ordenar progreso: primero los que tienen menor progreso (para motivar)
  progresoPorCurso.sort((a, b) => a.porcentaje - b.porcentaje);

  const progresoGeneral = totalLeccionesTotales > 0
    ? Math.round((totalLeccionesCompletadas / totalLeccionesTotales) * 100)
    : 0;

  // Calcular tiempo aproximado de estudio (basado en duración de lecciones completadas)
  let tiempoEstudioTotalMinutos = 0;
  cursosComprados.forEach((courseSlug) => {
    const curso = cursos.find((c) => c.slug === courseSlug);
    if (!curso) return;
    const moduloData = curso.modulos || {};
    Object.values(moduloData).forEach((modulo) => {
      if (modulo.lecciones && Array.isArray(modulo.lecciones)) {
        modulo.lecciones.forEach((leccion) => {
          if (leccion.duracion_seg) {
            tiempoEstudioTotalMinutos += leccion.duracion_seg / 60;
          }
        });
      }
    });
  });
  const horasEstudio = Math.round(tiempoEstudioTotalMinutos / 60);
  const minutosEstudio = tiempoEstudioTotalMinutos % 60;

  return React.createElement("section", {
    className: "p-4 bg-white rounded-2xl shadow-md max-w-2xl mx-auto mt-8",
  },
    React.createElement("div", { className: "flex items-center justify-between mb-6" },
      React.createElement("h1", { className: "text-2xl font-bold text-blue-900" }, "Mi Panel"),
      React.createElement("p", { className: "text-sm text-gray-500" }, `Hola, ${user.nombre}`)
    ),

    // Progreso general
    React.createElement("div", { className: "mb-6" },
      React.createElement("div", { className: "text-4xl font-bold text-blue-600 mb-2", },
        progresoGeneral
      ),
      React.createElement("p", { className: "text-sm text-gray-500" }, `${progresoGeneral}% de progreso general`)
    ),

    // Progreso por curso
    React.createElement("div", { className: "space-y-4" },
      progresoPorCurso.length === 0
        ? React.createElement("p", { className: "text-gray-500" }, "Aún no has completado lecciones en ningún curso.")
        : React.createElement("div", null,
          progresoPorCurso.map((item, index) => React.createElement("div", {
            key: index,
            className: "border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors",
          },
            React.createElement("div", { className: "flex justify-between items-start" },
              React.createElement("h3", { className: "font-medium text-blue-900" }, item.titulo),
              React.createElement("span", { className: "text-xs text-gray-400" }, `${item.progreso} de ${item.total} lecciones`)
            ),
            React.createElement("div", { className: "w-full bg-gray-200 rounded-h-full h-2 mb-2" },
              React.createElement("div", {
                style: { width: `${item.porcentaje}%`, height: "full" },
                className: "bg-blue-600 rounded-h-full transition-width duration-500 ease-out",
              })
            ),
            React.createElement("p", { className: "text-xs text-gray-500" }, `${item.porcentaje}% completado`)
          ))
        )
    ),

    // Métricas de aprendizaje
    React.createElement("div", { className: "mt-6 space-y-4" },
      // Tiempo de estudio
      React.createElement("div", { className: "bg-blue-50 rounded-lg p-4" },
        React.createElement("div", { className: "flex items-center justify-between mb-2" },
          React.createElement("div", { className: "text-2xl font-bold text-blue-600" }, `${horasEstudio}h ${minutosEstudio > 0 ? minutosEstudio : ""}min`),
          React.createElement("small", { className: "text-xs text-gray-500" }, "Tiempo de estudio")
        ),
        React.createElement("p", { className: "text-sm text-gray-600" }, "Minutos totales en las lecciones")
      ),

      // Flashcards y certificados
      React.createElement("div", { className: "grid grid-cols-2 gap-4" },
        React.createElement("div", { className: "bg-blue-50 rounded-lg p-3" },
          React.createElement("div", { className: "text-2xl font-bold text-blue-600" }, totalFlashcards),
          React.createElement("p", { className: "text-xs text-gray-500" }, "Flashcards")
        ),
        React.createElement("div", { className: "bg-blue-50 rounded-lg p-3" },
          React.createElement("div", { className: "text-2xl font-bold text-blue-600" }, totalCertificados),
          React.createElement("p", { className: "text-xs text-gray-500" }, "Certificados")
        )
      )
    )
  );
}

export default StudentPanel;