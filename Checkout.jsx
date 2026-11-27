import React from "react";

function Checkout({ state }) {
  const [cartItems, setCartItems] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [couponCode, setCouponCode] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
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

  const handleApplyCoupon = async () => {
    if (!user || !couponCode.trim()) return alert("Ingresa un código de cupón");
    const res = await fetch("/api/cupones/validar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.jwtToken}`,
      },
      body: JSON.stringify({ codigo: couponCode }),
    });
    const data = await res.json();
    if (data.success) {
      setDiscount(data.porcentaje);
      alert(`¡Cupón aplicado! Descuento del ${data.porcentaje}%`);
    } else {
      alert(data.error || "Cupón inválido o expirado");
    }
  };

  const proceedToPurchase = async () => {
    if (!user) return alert("Inicia sesión primero");
    if (cartItems.length === 0) return alert("Carrito vacío");

    let total = cartItems.reduce(
      (sum, c) => sum + (c.precioConDescuento || c.precio || 0),
      0
    );
    total = total * (1 - (discount / 100));
    total = Math.round(total * 100) / 100;

    if (!confirm(`¿Confirmas la compra de ${cartItems.length} curso(s) por $${total}?`)) return;

    const res = await fetch("/api/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.jwtToken}`,
      },
      body: JSON.stringify({
        courseSlugs: cartItems.map((c) => c.slug),
        cupon: couponCode || null,
      }),
    });
    const data = await res.json();

    if (data.success) {
      alert(
        `¡Compra exitosa! Total pagado: $${data.total.toFixed(2)}\n${data.coursesPurchased.length} curso(s) agregados a tu perfil.`
      );
      setCartItems([]);
      setCouponCode("");
      setDiscount(0);
      window.location.hash = "#/";
    } else {
      alert("Error en la compra: " + (data.error || "Intenta de nuevo"));
    }
  };

  if (loading) {
    return React.createElement("section", {
      className: "p-4",
    },
      React.createElement("h1", { className: "text-3xl font-bold text-blue-900 mb-6" }, "Checkout"),
      React.createElement("p", { className: "text-gray-600" }, "Cargando...")
    );
  }

  return React.createElement("section", { className: "p-4 max-w-2xl mx-auto" },
    React.createElement(
      "h1",
      { className: "text-3xl font-bold text-blue-900 mb-6" },
      "Resumen de Compra"
    ),

    cartItems.length === 0
      ? React.createElement("p", { className: "text-gray-500 mb-6" }, "Tu carrito está vacío")
      : React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" },
        cartItems.map((item, index) => React.createElement("div", {
          key: index,
          className: `border rounded-lg p-4 flex items-start`,
        },
          React.createElement("div", {
            className: "w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0",
          }, item.titulo.substring(0, 2).toUpperCase()),
          React.createElement("div", {
            className: "ml-4 flex-1",
          },
            React.createElement("h3", { className: "text-sm font-medium text-blue-900" }, item.titulo),
            React.createElement("p", { className: "text-gray-600 text-sm" }, "$" + (item.precioConDescuento || item.precio).toFixed(2)),
            React.createElement("p", { className: "text-xs text-gray-500" }, "Subtotal")
          )
        ))
      ),

    couponCode && discount > 0 ? React.createElement("div", {
      className: `bg-green-50 rounded p-3 mb-4`,
    },
      React.createElement("p", { className: "text-green-700 font-medium mb-2" }, "Cupón aplicado"),
      React.createElement("p", { className: "text-green-600" }, `-${discount}% de descuento`),
      React.createElement("p", { className: "text-green-600 font-medium" }, `Ahorras: $${(
        cartItems.reduce((sum, c) => sum + (c.precio || 0), 0) * (discount / 100)
      ).toFixed(2)}`)
    ) : React.createElement("div", { className: "mb-4" },
      React.createElement("div", { className: "mb-2" }, "Código de cupón (opcional):"),
      React.createElement("input", {
        value: couponCode,
        onChange: (e) => setCouponCode(e.target.value),
        className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors",
        placeholder: "Ej: BIENVENIDA10",
      }),
      React.createElement("button", {
        onClick: handleApplyCoupon,
        className: `bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20`,
      }, "Aplicar Cupón")
    ),

    React.createElement("div", { className: "bg-blue-50 rounded p-4 mt-6" },
      React.createElement("p", { className: "text-lg font-medium" }, "Subtotal: $", cartItems.reduce((sum, c) => sum + (c.precio || 0), 0).toFixed(2)),
      discount > 0 && React.createElement("p", { className: "text-gray-600 mt-1" }, "Descuento: -", discount, "%"),
      React.createElement("p", { className: "text-xl font-bold text-blue-900 mt-2" }, "Total: $", (cartItems.reduce((sum, c) => sum + (c.precioConDescuento || c.precio || 0), 0) * (1 - discount / 100)).toFixed(2)),
      React.createElement("button", {
        className: `w-full ${bluePrimary} text-white font-medium py-3 px-4 rounded hover:${blueHover} transition-colors mt-4 shadow-lg shadow-blue-500/20`,
        onClick: proceedToPurchase,
      }, "Proceder a Pago")
    ),
    React.createElement("p", { className: "text-center text-sm text-gray-500 mt-4" },
      "Después de la compra, los cursos se agregarán a tu perfil y podrás acceder a ellos inmediatamente."
    )
  );
}

export default function Checkout({ state }) {
  return React.createElement("div", null, null);
}
export { Checkout };