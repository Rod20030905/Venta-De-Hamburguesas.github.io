// PRODUCTOS ACTUALIZADOS - 11 HAMBURGUESAS + BEBIDAS
const PRODUCTS = {
  1: { name: "Burger Clásica", price: 10.00, type: "burger", icon: "fa-hamburger" },
  2: { name: "Burger Americana", price: 11.00, type: "burger", icon: "fa-bacon" },
  3: { name: "Burger Gaucha", price: 13.00, type: "burger", icon: "fa-cheese" },
  4: { name: "Burger Italiana", price: 13.00, type: "burger", icon: "fa-pepper-hot" },
  5: { name: "Burger Hawaiana", price: 13.00, type: "burger", icon: "fa-leaf" },
  6: { name: "Burger Ranchera", price: 14.00, type: "burger", icon: "fa-fish" },
  7: { name: "Americana Hamburguesa doble", price: 19.00, type: "burger", icon: "fa-mushroom" },
  8: { name: "BBQ Hamburguesa doble", price: 20.00, type: "burger", icon: "fa-egg" },
  9: { name: "Arequipeña Hamburguesa doble", price: 22.00, type: "burger", icon: "fa-apple-alt" },
  10: { name: "Saltada Hamburguesa doble", price: 22.00, type: "burger", icon: "fa-bolt" },
  11: { name: "Burger Olé Hamburguesa doble", price: 24.00, type: "burger", icon: "fa-crown" },
  12: { name: "Coca-Cola de 500ml", price: 4.00, type: "drink", icon: "fa-glass-whiskey" },
  13: { name: "Coca-Cola de 3 Litros", price: 12.00, type: "drink", icon: "fa-wine-bottle" },
  14: { name: "Inca-Cola de 500ml", price: 4.00, type: "drink", icon: "fa-wine-glass-alt" },
  15: { name: "Inca-Cola de 3 Litros", price: 12.00, type: "drink", icon: "fa-tint" },
  16: { name: "Fanta", price: 3.00, type: "drink", icon: "fa-wine-glass-alt" },
  17: { name: "Pepsi", price: 3.00, type: "drink", icon: "fa-wine-bottle" },
  18: { name: "Agua Loa de 625ml", price: 2.00, type: "drink", icon: "fa-wine-bottle" },
};

let cart = [];
let purchaseHistory = JSON.parse(localStorage.getItem('burgerGoldHistory')) || [];

// NAVEGACIÓN
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");
  };
});

// AGREGAR AL CARRITO
document.querySelectorAll(".btn-add").forEach(btn => {
  btn.onclick = () => addToCart(btn.dataset.id);
});

function addToCart(id) {
  const product = PRODUCTS[id];
  const existingItem = cart.find(item => item.id == id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  updateCart();
  notify(`${product.name} agregado al carrito`);
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id != id);
  updateCart();
  notify("Producto eliminado del carrito");
  saveCart();
}

function updateQuantity(id, change) {
  const item = cart.find(item => item.id == id);
  
  if (item) {
    item.quantity += change;
    
    if (item.quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    updateCart();
    saveCart();
  }
}

// ACTUALIZAR VISTA DEL CARRITO
function updateCart() {
  const container = document.getElementById("cart-items");
  let total = 0;
  
  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-message">El carrito está vacío</div>';
    document.getElementById("total").textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
    return;
  }
  
  container.innerHTML = '';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
      </div>
    `;
    
    container.appendChild(cartItem);
  });
  
  document.getElementById("total").textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent = cart.length;
}

// COMPLETAR VENTA
document.getElementById("checkout").onclick = function() {
  if (cart.length === 0) {
    notify("El carrito está vacío");
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const purchase = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    items: [...cart],
    total: total
  };
  
  purchaseHistory.unshift(purchase);
  localStorage.setItem('burgerGoldHistory', JSON.stringify(purchaseHistory));
  
  notify(`✅ Venta completada! Total: $${total.toFixed(2)}`);
  
  cart = [];
  updateCart();
  saveCart();
  updateHistory();
};

// HISTORIAL DE COMPRAS
function updateHistory() {
  const container = document.getElementById("history-items");
  
  if (purchaseHistory.length === 0) {
    container.innerHTML = '<div class="empty-message">No hay compras registradas</div>';
    return;
  }
  
  container.innerHTML = '';
  
  purchaseHistory.forEach(purchase => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    
    let itemsList = '';
    purchase.items.forEach(item => {
      itemsList += `${item.name} x${item.quantity}<br>`;
    });
    
    historyItem.innerHTML = `
      <div><strong>Venta #${purchase.id.toString().slice(-4)}</strong></div>
      <div>${itemsList}</div>
      <div class="history-total">Total: $${purchase.total.toFixed(2)}</div>
      <div class="history-date">${purchase.date}</div>
    `;
    
    container.appendChild(historyItem);
  });
}

// LIMPIAR CARRITO
document.getElementById("clear-cart").onclick = function() {
  if (cart.length === 0) {
    notify("El carrito ya está vacío");
    return;
  }
  
  cart = [];
  updateCart();
  saveCart();
  notify("Carrito vaciado");
};

// LIMPIAR HISTORIAL
document.getElementById("clear-history").onclick = function() {
  if (purchaseHistory.length === 0) {
    notify("No hay historial para limpiar");
    return;
  }
  
  if (confirm("¿Estás seguro de eliminar todo el historial de compras?")) {
    purchaseHistory = [];
    localStorage.removeItem('burgerGoldHistory');
    updateHistory();
    notify("Historial eliminado");
  }
};

// GUARDAR CARRITO EN LOCALSTORAGE
function saveCart() {
  localStorage.setItem('burgerGoldCart', JSON.stringify(cart));
}

// CARGAR CARRITO AL INICIAR
function loadCart() {
  const savedCart = localStorage.getItem('burgerGoldCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// NOTIFICACIÓN MEJORADA
function notify(text) {
  // Eliminar notificaciones anteriores
  const existingNotif = document.querySelector('.notification');
  if (existingNotif) {
    existingNotif.remove();
  }
  
  const n = document.createElement("div");
  n.className = "notification";
  n.textContent = text;
  document.body.appendChild(n);
  
  setTimeout(() => {
    if (n.parentNode) {
      n.remove();
    }
  }, 2000);
}

// INICIALIZAR
function init() {
  loadCart();
  updateHistory();
  
  // Agregar evento a los botones de navegación del historial
  document.querySelector('[data-target="history"]').addEventListener('click', updateHistory);
}

// EJECUTAR AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', init);

// Hacer funciones disponibles globalmente
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;