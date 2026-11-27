import React, { useState } from "react";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!nombre.trim() || nombre.trim().length < 3) {
      errs.nombre = "Escribe tu nombre completo (mínimo 3 caracteres).";
    }
    if (!email.trim()) {
      errs.email = "El correo es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errs.email = "Escribe un correo válido.";
    }
    if (!password) {
      errs.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      errs.password = "Mínimo 6 caracteres.";
    }
    if (!confirm) {
      errs.confirm = "Confirma tu contraseña.";
    } else if (confirm !== password) {
      errs.confirm = "Las contraseñas no coinciden.";
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim(), password }),
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
        setServerError(data.error || "Error en el registro. Intenta de nuevo.");
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

  /* Fuerza de contraseña */
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /\d/.test(password) ? 4 : 3;
  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];

  return React.createElement("section", {
    className: "min-h-screen bg-gradient-to-br from-blue-900/50 to-blue-50 p-4 md:p-8 flex items-center justify-center",
  },
    React.createElement("div", {
      className: "bg-white/95 backdrop-blur-sm rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-blue-500/10",
    },
      React.createElement("h2", {
        className: "text-3xl font-bold text-blue-900 text-center mb-2",
      }, "Crear cuenta"),
      React.createElement("p", {
        className: "text-center text-sm text-blue-500 mb-8",
      }, "Es gratis. Accede a todos los cursos."),

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
        React.createElement("div", { className: "space-y-4 mb-6" },

          /* Nombre */
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-1.5",
            }, "Nombre completo"),
            React.createElement("input", {
              type: "text",
              value: nombre,
              onChange: (e) => { setNombre(e.target.value); setErrors((v) => ({ ...v, nombre: "" })); },
              className: fieldClass("nombre"),
              placeholder: "Tu nombre completo",
              autoComplete: "name",
            }),
            errors.nombre && React.createElement("p", { className: "mt-1 text-xs text-red-600" }, errors.nombre)
          ),

          /* Email */
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
            errors.email && React.createElement("p", { className: "mt-1 text-xs text-red-600" }, errors.email)
          ),

          /* Contraseña */
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-1.5",
            }, "Contraseña"),
            React.createElement("input", {
              type: "password",
              value: password,
              onChange: (e) => { setPassword(e.target.value); setErrors((v) => ({ ...v, password: "", confirm: "" })); },
              className: fieldClass("password"),
              placeholder: "Mínimo 6 caracteres",
              autoComplete: "new-password",
            }),
            /* Barra de fuerza */
            password && React.createElement("div", { className: "mt-2 flex items-center gap-2" },
              React.createElement("div", { className: "flex-1 h-1.5 rounded-full bg-blue-100 overflow-hidden" },
                React.createElement("div", {
                  className: `h-full rounded-full transition-all duration-300 ${strengthColor[strength]}`,
                  style: { width: `${strength * 25}%` },
                })
              ),
              React.createElement("span", { className: "text-xs text-blue-500 w-12" }, strengthLabel[strength])
            ),
            errors.password && React.createElement("p", { className: "mt-1 text-xs text-red-600" }, errors.password)
          ),

          /* Confirmar contraseña */
          React.createElement("div", null,
            React.createElement("label", {
              className: "block text-sm font-medium text-blue-700 mb-1.5",
            }, "Confirmar contraseña"),
            React.createElement("input", {
              type: "password",
              value: confirm,
              onChange: (e) => { setConfirm(e.target.value); setErrors((v) => ({ ...v, confirm: "" })); },
              className: fieldClass("confirm"),
              placeholder: "Repite tu contraseña",
              autoComplete: "new-password",
            }),
            errors.confirm && React.createElement("p", { className: "mt-1 text-xs text-red-600" }, errors.confirm)
          )
        ),

        React.createElement("button", {
          type: "submit",
          disabled: loading,
          className: "w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        },
          loading && React.createElement("span", {
            className: "inline-block size-4 rounded-full border-2 border-white/40 border-t-white animate-spin",
          }),
          loading ? "Creando cuenta…" : "Crear cuenta gratis"
        )
      ),

      React.createElement("p", {
        className: "text-center mt-6 text-sm text-blue-500",
      },
        "¿Ya tienes cuenta? ",
        React.createElement("a", {
          href: "#/login",
          className: "text-blue-600 font-semibold hover:underline",
        }, "Inicia sesión")
      )
    )
  );
}

export default Register;
