import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "El correo es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errs.email = "Escribe un correo válido.";
    }
    if (!password) {
      errs.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      errs.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok) {
        const userData = {
          id: data.user.id,
          nombre: data.user.nombre,
          email: data.user.email,
          rol: data.user.rol,
          jwtToken: data.token,
        };
        localStorage.setItem("biocursos_session_v1", JSON.stringify(userData));
        sessionStorage.setItem("jwtToken", data.token);
        window.location.hash = data.user.rol === "admin" ? "#/admin" : "#/";
      } else {
        setServerError(data.error || "Correo o contraseña incorrectos.");
      }
    } catch (err) {
      setServerError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) =>
    `shadow w-full rounded-lg border px-4 py-3 leading-tight focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? "border-red-400 focus:ring-red-300 bg-red-50"
        : "border-blue-200 focus:ring-blue-500 focus:border-blue-600"
    }`;

  return React.createElement("section", {
    className: "min-h-screen bg-gradient-to-br from-blue-900/50 to-blue-50 p-4 md:p-8 flex items-center justify-center",
  },
    React.createElement("div", {
      className: "bg-white/95 backdrop-blur-sm rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-blue-500/10",
    },
      React.createElement("h2", {
        className: "text-3xl font-bold text-blue-900 text-center mb-2",
      }, "Iniciar sesión"),
      React.createElement("p", {
        className: "text-center text-sm text-blue-500 mb-8",
      }, "Accede a tus cursos y progreso"),

      serverError && React.createElement("div", {
        className: "mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700",
      },
        React.createElement("span", null, "⚠️"),
        React.createElement("span", null, serverError)
      ),

      React.createElement("form", {
        onSubmit: handleSubmit,
        noValidate: true,
      },
        React.createElement("div", {
          className: "space-y-4 mb-6",
        },
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-1.5",
            }, "Correo electrónico"),
            React.createElement("input", {
              type: "email",
              value: email,
              onChange: (e) => { setEmail(e.target.value); setErrors((v) => ({ ...v, email: "" })); },
              className: fieldClass("email"),
              placeholder: "tu@correo.ejemplo",
              autoComplete: "email",
            }),
            errors.email && React.createElement("p", {
              className: "mt-1 text-xs text-red-600",
            }, errors.email)
          ),
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-1.5",
            }, "Contraseña"),
            React.createElement("input", {
              type: "password",
              value: password,
              onChange: (e) => { setPassword(e.target.value); setErrors((v) => ({ ...v, password: "" })); },
              className: fieldClass("password"),
              placeholder: "Tu contraseña",
              autoComplete: "current-password",
            }),
            errors.password && React.createElement("p", {
              className: "mt-1 text-xs text-red-600",
            }, errors.password)
          )
        ),
        React.createElement("div", {
          className: "flex justify-end mb-6",
        },
          React.createElement("a", {
            href: "#/register",
            className: "text-blue-600 text-sm font-medium hover:underline",
          }, "Crear una cuenta")
        ),
        React.createElement("button", {
          type: "submit",
          disabled: loading,
          className: "w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        },
          loading && React.createElement("span", {
            className: "inline-block size-4 rounded-full border-2 border-white/40 border-t-white animate-spin",
          }),
          loading ? "Entrando…" : "Entrar"
        )
      ),
      React.createElement("p", {
        className: "text-center mt-6 text-sm text-blue-500",
      },
        "¿No tienes cuenta? ",
        React.createElement("a", {
          href: "#/register",
          className: "text-blue-600 font-semibold hover:underline",
        }, "Regístrate gratis")
      )
    )
  );
}

export default Login;