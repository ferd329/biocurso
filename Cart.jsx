import React from "react";

function Cart({ state }) {
  const [cartItems, setCartItems] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("biocursos_session_v1");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }

    if (user) {
      fetch("/api/cart", {
        headers: { Authorization: `Bearer ${user.jwtToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setCartItems(data.cart || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return React.createElement("section", {
      className: "p-4",
    },
      React.createElement("h1", { className: "text-2xl font-bold text-blue-900 mb-6" }, "Carrito"),
      React.createElement("p", { className: "text-gray-500" }, "Cargando...")
    );
  }

  if (!user) {
    return React.createElement("section", {
      className: "p-4",
    },
      React.createElement("h1", { className: "text-2xl font-bold text-blue-900 mb-6" }, "Carrito"),
      React.createElement("p", { className: "text-gray-500" },
        "Inicia sesión para ver tu carrito"
      ),
      React.createElement("a", {
        href: "#/login",
        className: `bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20`,
      }, "Iniciar sesión")
    );
  }

  const total = cartItems.reduce(
    (sum, c) => sum + (c.precio || 0),
    0
  );

  return React.createElement("section", { className: "p-4" },
    React.createElement("h1", { className: "text-2xl font-bold text-blue-900 mb-6" }, "Carrito"),
    cartItems.length === 0
      ? React.createElement("p", { className: "text-gray-500 mb-6" }, "Tu carrito está vacío")
      : React.createElement("div", { className: "grid grid-cols-1 gap-4 mb-6" },
        cartItems.map((item, index) => React.createElement("div", {
          key: index,
          className: "border rounded-lg p-4 flex items-start",
        },
          React.createElement("div", {
            className: "w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0",
          }, item.titulo.substring(0, 2).toUpperCase()),
          React.createElement("div", {
            className: "ml-4 flex-1",
          },
            React.createElement("h3", { className: "text-sm font-medium text-blue-900" }, item.titulo),
            React.createElement("p", { className: "text-xs text-gray-500" }, "$" + (item.precio || 0).toFixed(2))
          ),
          React.createElement("button", {
            onClick: () => { setCartItems(cartItems.filter(c => c !== item)); },
            className: "text-xs text-blue-400 hover:text-blue-600 transition-colors",
          }, "Quitar")
        ))
      ),
    total > 0 && React.createElement("div", { className: "bg-blue-50 rounded p-4 mt-6" },
      React.createElement("p", { className: "text-lg font-medium" }, "Total: $", total.toFixed(2)),
      React.createElement("button", {
        className: `w-full ${bluePrimary} text-white font-medium py-3 px-6 rounded-full mt-4 transition-all hover:${blueHover} shadow-lg shadow-blue-500/20`,
        onClick: () => window.location.hash = "#/checkout",
      }, "Proceder a pago")
    ),
    React.createElement("p", { className: "text-center text-sm text-gray-500 mt-4" },
      "Los cursos se agregan a tu perfil después de la compra."
    )
  );
}

export default function Cart({ state }) {
  return React.createElement("div", null, null);
}
export { Cart };