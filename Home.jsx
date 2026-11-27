import React from "react";

const cursos = [
  {
    id: 1,
    icon: "🧬",
    titulo: "Fundamentos de Biología",
    nivel: "Preparatoria",
    lecciones: 24,
    color: "from-emerald-500 to-teal-600",
    ruta: "#/curso/fundamentos-biologia",
  },
  {
    id: 2,
    icon: "⚗️",
    titulo: "Fundamentos de Química",
    nivel: "Preparatoria",
    lecciones: 28,
    color: "from-indigo-500 to-violet-600",
    ruta: "#/curso/fundamentos-quimica",
  },
  {
    id: 3,
    icon: "🌿",
    titulo: "Fotosíntesis y Respiración Celular",
    nivel: "Preparatoria",
    lecciones: 18,
    color: "from-green-500 to-emerald-600",
    ruta: "#/curso/fotosintesis-celular",
  },
  {
    id: 4,
    icon: "🔬",
    titulo: "Biología Molecular",
    nivel: "Universidad",
    lecciones: 32,
    color: "from-cyan-500 to-blue-600",
    ruta: "#/curso/biologia-molecular",
  },
];

const stats = [
  { valor: "12+", etiqueta: "Cursos disponibles" },
  { valor: "4,800+", etiqueta: "Estudiantes activos" },
  { valor: "98%", etiqueta: "Satisfacción" },
  { valor: "24/7", etiqueta: "Acceso libre" },
];

const beneficios = [
  {
    icon: "🎯",
    titulo: "Aprendizaje dirigido",
    desc: "Rutas de estudio adaptadas a tu nivel y objetivos académicos.",
  },
  {
    icon: "🧪",
    titulo: "Laboratorios virtuales",
    desc: "Practica experimentos en un entorno seguro e interactivo.",
  },
  {
    icon: "📊",
    titulo: "Seguimiento de progreso",
    desc: "Visualiza tu avance y refuerza los temas donde más lo necesitas.",
  },
];

function TarjetaCurso({ curso }) {
  return React.createElement(
    "a",
    { href: curso.ruta, className: "bc-card-curso" },
    React.createElement(
      "div",
      { className: `bc-card-cover bg-gradient-to-br ${curso.color}` },
      React.createElement("span", { className: "bc-card-icon" }, curso.icon),
      React.createElement(
        "span",
        { className: "bc-card-badge" },
        curso.nivel
      )
    ),
    React.createElement(
      "div",
      { className: "bc-card-body" },
      React.createElement("h3", { className: "bc-card-titulo" }, curso.titulo),
      React.createElement(
        "p",
        { className: "bc-card-meta" },
        `${curso.lecciones} lecciones`
      ),
      React.createElement(
        "span",
        { className: "bc-card-cta" },
        "Ver curso →"
      )
    )
  );
}

function Home() {
  return React.createElement(
    "div",
    { className: "bc-home" },

    /* ── HERO ── */
    React.createElement(
      "section",
      { className: "bc-hero" },
      React.createElement("div", { className: "bc-hero-blur bc-hero-blur--left" }),
      React.createElement("div", { className: "bc-hero-blur bc-hero-blur--right" }),
      React.createElement(
        "div",
        { className: "bc-hero-inner" },
        React.createElement(
          "div",
          { className: "bc-hero-eyebrow" },
          React.createElement("span", { className: "bc-pill" }, "🔬 Plataforma educativa"),
          React.createElement("span", { className: "bc-pill bc-pill--accent" }, "✨ Nuevo: Lab virtual 2.0")
        ),
        React.createElement(
          "h1",
          { className: "bc-hero-title" },
          "Aprende ",
          React.createElement("span", { className: "bc-gradient-text" }, "Biología y Química"),
          " que sí se entienden"
        ),
        React.createElement(
          "p",
          { className: "bc-hero-desc" },
          "Cursos claros, laboratorios interactivos y repaso inteligente para preparatoria y universidad. Todo en un solo lugar."
        ),
        React.createElement(
          "div",
          { className: "bc-hero-actions" },
          React.createElement(
            "a",
            { href: "#/login", className: "bc-btn bc-btn--primary" },
            "Comenzar gratis"
          ),
          React.createElement(
            "a",
            { href: "#/planes", className: "bc-btn bc-btn--ghost" },
            "Ver planes"
          )
        )
      )
    ),

    /* ── STATS ── */
    React.createElement(
      "section",
      { className: "bc-stats" },
      React.createElement(
        "div",
        { className: "bc-stats-inner" },
        stats.map((s) =>
          React.createElement(
            "div",
            { key: s.etiqueta, className: "bc-stat" },
            React.createElement("span", { className: "bc-stat-valor" }, s.valor),
            React.createElement("span", { className: "bc-stat-etiqueta" }, s.etiqueta)
          )
        )
      )
    ),

    /* ── CURSOS ── */
    React.createElement(
      "section",
      { className: "bc-section" },
      React.createElement(
        "div",
        { className: "bc-section-inner" },
        React.createElement(
          "div",
          { className: "bc-section-header" },
          React.createElement("span", { className: "bc-eyebrow" }, "Catálogo"),
          React.createElement("h2", { className: "bc-section-title" }, "Cursos destacados"),
          React.createElement(
            "p",
            { className: "bc-section-desc" },
            "Contenido diseñado por expertos en ciencias para que aprendas paso a paso."
          )
        ),
        React.createElement(
          "div",
          { className: "bc-cursos-grid" },
          cursos.map((c) => React.createElement(TarjetaCurso, { key: c.id, curso: c }))
        ),
        React.createElement(
          "div",
          { className: "bc-section-footer" },
          React.createElement(
            "a",
            { href: "#/cursos", className: "bc-btn bc-btn--outline" },
            "Ver todos los cursos"
          )
        )
      )
    ),

    /* ── BENEFICIOS ── */
    React.createElement(
      "section",
      { className: "bc-section bc-section--alt" },
      React.createElement(
        "div",
        { className: "bc-section-inner" },
        React.createElement(
          "div",
          { className: "bc-section-header" },
          React.createElement("span", { className: "bc-eyebrow" }, "¿Por qué BioCursos?"),
          React.createElement("h2", { className: "bc-section-title" }, "Todo lo que necesitas para aprender ciencias")
        ),
        React.createElement(
          "div",
          { className: "bc-beneficios-grid" },
          beneficios.map((b) =>
            React.createElement(
              "div",
              { key: b.titulo, className: "bc-beneficio" },
              React.createElement("div", { className: "bc-beneficio-icon" }, b.icon),
              React.createElement("h3", { className: "bc-beneficio-titulo" }, b.titulo),
              React.createElement("p", { className: "bc-beneficio-desc" }, b.desc)
            )
          )
        )
      )
    ),

    /* ── CTA FINAL ── */
    React.createElement(
      "section",
      { className: "bc-cta" },
      React.createElement(
        "div",
        { className: "bc-cta-inner" },
        React.createElement("h2", { className: "bc-cta-title" }, "¿Listo para empezar?"),
        React.createElement(
          "p",
          { className: "bc-cta-desc" },
          "Únete a miles de estudiantes que ya aprenden con BioCursos."
        ),
        React.createElement(
          "a",
          { href: "#/login", className: "bc-btn bc-btn--white" },
          "Crear cuenta gratuita"
        )
      )
    )
  );
}

export default Home;
