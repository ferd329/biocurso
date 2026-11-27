import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/css/styles.css";

// Importar datos globales desde data.js (inyectado en index.html)
import "./data.js";

// Rutas de la aplicación
import Home from "./pages/Home.jsx";
import Planes from "./pages/Planes.jsx";
import Curso from "./pages/Curso.jsx";
import Empresa from "./pages/Empresa.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout";
import StudentPanel from "./pages/StudentPanel.jsx";

// --- Página Principal ---
function Home() {
  return React.createElement("section", {
    className: "min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 md:p-8",
  },
    React.createElement("div", {
      className: "max-w-7xl mx-auto",
    },
      React.createElement("div", {
        className: "grid lg:grid-cols-2 gap-8 items-center",
      },
        React.createElement("div", {
          className: "pt-12 md:pt-0",
        },
          React.createElement("h1", {
            className: "text-5xl md:text-6xl font-bold text-blue-900 tracking-tighter mb-4",
          }, "BioCursos"),
          React.createElement("p", {
            className: "text-lg md:text-xl text-gray-600 mb-6 max-w-xl",
          },
            "Plataforma integral de aprendizaje en Biología y Química para preparatoria y universidad. Accede a cursos de calidad, laboratorios virtuales y materiales interactivos."
          ),
          React.createElement("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8",
          }, [
            {
              id: 1,
              titulo: "Fundamentos de Biologia",
              nivel: "Preparatoria",
            },
            {
              id: 2,
              titulo: "Fundamentos de Quimica",
              nivel: "Preparatoria",
            },
            {
              id: 3,
              titulo: "Fotosintesis y Respiracion Cellular",
              nivel: "Preparatoria",
            },
          ].map((curso) => React.createElement("div", {
            key: curso.id,
            className: "group rounded-lg p-5 hover:bg-blue-100 transition-colors cursor-pointer border-blue-200",
          },
            React.createElement("h3", {
              className: "text-xl font-medium text-blue-900 group-hover:bg-blue-600 transition-colors",
            }, curso.titulo),
            React.createElement("p", {
              className: "text-sm text-gray-500 mt-1",
            }, "Nivel: " + curso.nivel)
          ))),
          React.createElement("div", {
            className: "mt-8",
          },
            React.createElement("a", {
              href: "#/login",
              className: "inline-block bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20",
            }, "Iniciar sesion para comenzar")
          )
        ),
        React.createElement("div", {
          className: "lg:col-span-2",
        },
          React.createElement("div", {
            className: "space-y-4",
          }, [
            {
              id: 1,
              titulo: "Fundamentos de Biologia",
              nivel: "Preparatoria",
            },
            {
              id: 2,
              titulo: "Fundamentos de Quimica",
              nivel: "Preparatoria",
            },
            {
              id: 3,
              titulo: "Fotosintesis y Respiracion Cellular",
              nivel: "Preparatoria",
            },
          ].map((curso) => React.createElement("div", {
            key: curso.id,
            className: "border rounded-lg p-6 group-hover:shadow-xl transition-shadow border-blue-200",
          },
            React.createElement("div", {
              className: "h-48 bg-blue-100/50 rounded-lg flex items-center justify-center",
            }, React.createElement("div", {
              className: "text-blue-600 text-sm font-medium",
            }, "Curso de " + curso.nivel)),
            React.createElement("h3", {
              className: "text-lg font-medium text-blue-900",
            }, curso.titulo),
            React.createElement("p", {
              className: "text-sm text-gray-500 mt-1 line-clamp-2",
            }, "Un viaje completo por los principios fundamentales de la biologia moderna.")
          ))))
        )
      )
    )
  );
}

// --- Página de Planes ---
function Planes() {
  return React.createElement("section", {
    className: "p-4 max-w-4xl mx-auto bg-blue-50",
  },
    React.createElement(
      "h1",
      { className: "text-3xl font-bold text-blue-900 mb-6" },
      "Nuestros Planes"
    ),
    React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-6",
    },
      React.createElement("div", {
        className: "border rounded-lg p-6 hover:bg-blue-100 transition-colors",
      },
        React.createElement("h3", { className: "text-xl font-medium text-blue-900 mb-4" }, "Plan Basico"),
        React.createElement("p", { className: "text-gray-600 mb-4" }, "$49.99/mes"),
        React.createElement("ul", { className: "space-y-2 text-sm" },
          React.createElement("li", null, "Acceso a todos los cursos"),
          React.createElement("li", null, "Material didactico"),
          React.createElement("li", null, "Flashcards interactivos")
        )
      ),
      React.createElement("div", {
        className: "border rounded-lg p-6 hover:bg-blue-100 transition-colors",
      },
        React.createElement("h3", { className: "text-xl font-medium text-blue-900 mb-4" }, "Plan Pro"),
        React.createElement("p", { className: "text-gray-600 mb-4" }, "$499.99/año"),
        React.createElement("ul", { className: "space-y-2 text-sm" },
          React.createElement("li", null, "Todo lo Basico"),
          React.createElement("li", null, "Laboratorios virtuales"),
          React.createElement("li", null, "Prioridad en soporte")
        )
      )
    )
  );
}

// --- Página de Curso ---
function Curso({ params }) {
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
    return React.createElement("section", {
      className: "p-4",
    },
      React.createElement("h1", {
        className: "text-3xl font-bold text-blue-900",
      }, "Curso"),
      React.createElement("p", {
        className: "text-gray-600",
      }, "Curso no encontrado")
    );
  }

  const hasPurchased = user?.cursos_comprados && user.cursos_comprados.includes(curso.slug);

  return React.createElement("section", {
    className: "p-4 max-w-2xl mx-auto",
  },
    React.createElement("h1", {
      className: "text-3xl font-bold text-blue-900 mb-6",
    }, curso.titulo),

    hasPurchased
      ? null
      : React.createElement("div", {
        className: "border rounded-lg p-4 mb-6 bg-blue-100",
      },
        React.createElement("p", {
          className: "text-blue-700 font-medium mb-3",
        }, "Compra requerida: Accede a este curso adquiriendolo individually o suscribiendote a un plan."
        ),
        React.createElement("button", {
          className: "bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors w-full",
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
            : "Añadir al carrito $" + curso.precio_individual.toFixed(2)
        )
      ),

    !hasPurchased && user && Object.keys(progress).length > 0 ? React.createElement("div", {
      className: "mt-6 p-4 bg-blue-50 rounded",
    },
      React.createElement("h3", { className: "text-sm font-medium text-blue-800 mb-2" }, "Progreso"),
      React.createElement("p", { className: "text-blue-600 text-sm" },
        "Lecciones completadas: ",
        progress.lecciones_completadas || 0,
        " de ",
        Object.keys(curso?.modulos || {}).length || 10
      )
    ) : null,

    React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-8",
    },
      React.createElement("div", {
        className: "text-gray-600",
      },
        React.createElement("p", null, curso.descripcion)
      ),
      React.createElement("div", {
        className: "grid grid-cols-2 gap-4 text-sm",
      },
        React.createElement("div", {
          null,
          React.createElement("dt", { className: "font-semibold" }, "Area"),
          React.createElement("dd", null, curso.area)
        ),
        React.createElement("div", {
          null,
          React.createElement("dt", { className: "font-semibold" }, "Tema"),
          React.createElement("dd", null, curso.tema)
        ),
        React.createElement("div", {
          null,
          React.createElement("dt", { className: "font-semibold" }, "Nivel"),
          React.createElement("dd", null, curso.nivel_educativo)
        ),
        React.createElement("div", {
          null,
          React.createElement("dt", { className: "font-semibold" }, "Formato"),
          React.createElement("dd", null, curso.formato)
        ),
        React.createElement("div", {
          null,
          React.createElement("dt", { className: "font-semibold" }, "Precio"),
          React.createElement("dd", null, "$" + curso.precio_individual)
        })
      )
    )
  );
});

// --- Página de Empresa ---
function Empresa() {
  return React.createElement("section", {
    className: "p-4 max-w-2xl mx-auto bg-blue-50",
  },
    React.createElement("h1", {
      className: "text-3xl font-bold text-blue-900 mb-6",
    }, "Portal de Empresas"),
    React.createElement("p", {
      className: "text-gray-600 text-lg mb-6",
    },
      "Registrese para obtener acceso empresarial a nuestros cursos y laboratorios."
    ),
    React.createElement("form", {
      className: "space-y-4",
    },
      React.createElement("div", null,
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
      React.createElement("div", null,
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
        className: "bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors",
      },
        "Solicitar acceso empresarial"
      )
    )
  );
}

// --- Página de Login ---
function Login() {
  return React.createElement("section", {
    className: "min-h-screen bg-gradient-to-br from-blue-900/50 to-blue-50 p-4 md:p-8 flex items-center justify-center",
  },
    React.createElement("div", {
      className: "bg-white/95 backdrop-blur-sm rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-blue-500/10",
    },
      React.createElement("h2", {
        className: "text-3xl font-bold text-blue-900 text-center mb-8",
      }, "Iniciar sesion"),
      React.createElement("form", {
        onSubmit: (e) => {
          e.preventDefault();
        },
      },
        React.createElement("div", {
          className: "space-y-4 mb-6",
        },
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-2",
            },
              "Correo electronico"
            ),
            React.createElement("input", {
              type: "email",
              name: "email",
              required: true,
              className: "shadow w-full rounded-lg border border-blue-200 px-4 py-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors",
              placeholder: "tu@correo.ejemplo"
            })
          ),
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-2",
            },
              "Contraseña"
            ),
            React.createElement("input", {
              type: "password",
              name: "password",
              required: true,
              className: "shadow w-full rounded-lg border border-blue-200 px-4 py-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors",
              placeholder: "Tu contraseña"
            })
          )
        ),
        React.createElement("div", {
          className: "flex justify-end mb-8",
        },
          React.createElement("a", {
            href: "#/register",
            className: "text-blue-600 text-sm font-medium hover:underline",
          }, "Crear una cuenta")
        ),
        React.createElement("button", {
          type: "submit",
          className: "w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20",
        }, "Entrar")
      ),
      React.createElement("p", {
        className: "text-center mt-8 text-sm text-gray-500",
      }, "¿No tienes cuenta? <a href=\"#/register\" className=\"text-blue-600 font-medium hover:underline\">Regístrate</a>")
    )
  );
}

// --- Página de Admin ---
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

  if (!token) {
    return React.createElement("section", {
      className: "p-4 text-center",
    },
      React.createElement("h1", { className: "text-3xl font-bold text-blue-900 mb-4" }, "Panel de Administracion"),
      React.createElement("p", { className: "text-gray-600" },
        "Por favor inicia sesión para acceder al panel"
      ),
      React.createElement("a", {
        href: "#/login",
        className: "bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors",
      }, "Iniciar sesión")
    );
  }

  return React.createElement("section", {
    className: "p-4",
  },
    React.createElement("h1", { className: "text-3xl font-bold text-blue-900 mb-6" }, "Panel de Administracion"),
    
    React.createElement("div", {
      className: "grid grid-cols-2 gap-4 mb-6",
    },
      React.createElement("div", {
        className: "bg-blue-50 rounded-lg p-4 border border-blue-200",
      },
        React.createElement("h3", { className: "text-sm font-medium text-blue-900 mb-2" }, "Usuarios totales"),
        React.createElement("p", { className: "text-3xl font-bold text-blue-900" }, users.length)
      ),
      React.createElement("div", {
        className: "bg-blue-50 rounded-lg p-4 border border-blue-200",
      },
        React.createElement("h3", { className: "text-sm font-medium text-blue-900 mb-2" }, "Administradores"),
        React.createElement("p", { className: "text-3xl font-bold text-blue-900" }, 
          users.filter(u => u.rol === "admin").length)
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
            React.createElement("th", { className: "text-left p-4 text-xs font-medium text-blue-600 uppercase tracking-wider" }, "Email"),
            React.createElement("th", { className: "text-left p-4 text-xs font-medium text-blue-600 uppercase tracking-wider" }, "Rol"),
            React.createElement("th", { className: "text-left p-4 text-xs font-medium text-blue-600 uppercase tracking-wider" }, "Acciones")
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
                React.createElement("span", {
                  className: `inline-block px-2 py-0.5 text-xs font-medium rounded ${user.rol === "admin" ? "bg-red-100 text-red-800" : user.rol === "empresa" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`,
                }, user.rol)
              ),
              React.createElement("td", { className: "p-4 text-sm" },
                React.createElement("button", {
                  onClick: () => handleDelete(user.id),
                  className: "text-sm text-blue-500 hover:text-blue-700 underline me-2",
                }, "Eliminar"),
                user.rol !== "admin" && React.createElement("button", {
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

// --- Página de Register (simple) ---
function Register() {
  return React.createElement("section", {
    className: "min-h-screen bg-gradient-to-br from-blue-900/50 to-blue-50 p-4 md:p-8 flex items-center justify-center",
  },
    React.createElement("div", {
      className: "bg-white/95 backdrop-blur-sm rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-blue-500/10",
    },
      React.createElement("h2", {
        className: "text-3xl font-bold text-blue-900 text-center mb-8",
      }, "Registrese"),
      React.createElement("form", {
        onSubmit: (e) => e.preventDefault(),
      },
        React.createElement("div", {
          className: "space-y-4 mb-6",
        },
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-2",
            },
              "Nombre completo"
            ),
            React.createElement("input", {
              type: "text",
              name: "nombre",
              required: true,
              className: "shadow w-full rounded-lg border border-blue-200 px-4 py-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors",
              placeholder: "Tu nombre completo"
            })
          ),
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-2",
            },
              "Correo electronico"
            ),
            React.createElement("input", {
              type: "email",
              name: "email",
              required: true,
              className: "shadow w-full rounded-lg border border-blue-200 px-4 py-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors",
              placeholder: "tu@correo.ejemplo"
            })
          ),
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-2",
            },
              "Contraseña"
            ),
            React.createElement("input", {
              type: "password",
              name: "password",
              required: true,
              className: "shadow w-full rounded-lg border border-blue-200 px-4 py-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors",
              placeholder: "Crea una contraseña"
            })
          )
        ),
        React.createElement("div", {
          className: "flex justify-end",
        },
          React.createElement("a", {
            href: "#/login",
            className: "text-blue-600 text-sm font-medium hover:underline",
          }, "Ya tengo cuenta"
          ),
        React.createElement("button", {
          type: "submit",
          className: "w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20",
        }, "Crear cuenta")
      )
    )
  );
}

// --- Not Found ---
function NotFound() {
  return React.createElement("section", {
    className: "p-4 text-center bg-blue-50",
  },
    React.createElement("h1", {
      className: "text-4xl font-bold text-blue-900",
    }, "404"),
    React.createElement("p", {
      className: "text-gray-600",
    }, "La pagina que buscas no existe.")
  );
}

// --- Raíz ---
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plantas" element={<Planes />} />
      <Route path="/curso/:slug" element={<Curso />} />
      <Route path="/empresa" element={<Empresa />} />
      <Route path="/login" element={<Login />} />
      <Route path="/panel" element={<StudentPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);